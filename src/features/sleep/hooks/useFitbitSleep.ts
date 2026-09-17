import { useState, useEffect, useRef } from "react";
import { parseFitbitSleep } from "../../../services/fitbitSleep";
import { getAccessToken } from "../../../services/fitbitAuth";
import { ParsedSleepData } from "../../../@types/fitbit";
import SleepRecordController from "../../../services/SleepRecordController";
import Controller from "../../../services/controller";
import { getMemberId } from "../../../services/authService";

const controller = new SleepRecordController({ modelId: "sleep_record" });

// ✅ 서버에서 파싱된 데이터로 변환
const parseServerSleep = (record: any): ParsedSleepData => {
  console.log("parseServerSleep", record);
  const start = new Date(record.START_TIME);
  const end = new Date(record.END_TIME);

  const toAmPm = (hour: number): "AM" | "PM" => (hour >= 12 ? "PM" : "AM");
  const to12Hour = (hour: number) => hour % 12 || 12;

  const totalMinutes = record.MINUTES_ASLEEP;
  const deepPct =
    totalMinutes > 0
      ? Math.round((record.DEEP_SLEEP_MINUTES / totalMinutes) * 100)
      : 0;
  const lightPct =
    totalMinutes > 0
      ? Math.round((record.LIGHT_SLEEP_MINUTES / totalMinutes) * 100)
      : 0;
  const remPct =
    totalMinutes > 0
      ? Math.round((record.REM_SLEEP_MINUTES / totalMinutes) * 100)
      : 0;
  const wakePct =
    totalMinutes > 0
      ? Math.round((record.WAKE_MINUTES / totalMinutes) * 100)
      : 0;

  return {
    quality: record.EFFICIENCY,
    totalSleepTime: {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    },
    timeInBed: {
      hours: Math.floor(record.TIME_IN_BED / 60),
      minutes: record.TIME_IN_BED % 60,
    },
    bedtime: {
      hour: to12Hour(start.getHours()),
      minute: start.getMinutes(),
      ampm: toAmPm(start.getHours()),
    },
    wakeTime: {
      hour: to12Hour(end.getHours()),
      minute: end.getMinutes(),
      ampm: toAmPm(end.getHours()),
    },
    analysis: {
      regularity: "-",
      heartRate: "-",
      temperatureChange: "-",
      temperatureStability: "-",
      sleepLatency: `${record.SLEEP_LATENCY_MINUTES ?? 0}분`,
      deepSleep: `${deepPct}%`,
      lightSleep: `${lightPct}%`,
      remSleep: `${remPct}%`,
      awakeTime: `${wakePct}%`,
      snoring: "-",
    },
    sleepLevels: record.SLEEP_LEVELS_DATA ?? [],
  };
};

// 특정 날짜 수면 데이터 (서버 우선, 없으면 Fitbit에서 동기화)
export const useFitbitSleepByDate = (date: Date) => {
  const [data, setData] = useState<ParsedSleepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsFitbitLogin, setNeedsFitbitLogin] = useState(false);

  const dateStr = date.toISOString().split("T")[0];

  // 요청 ID로 가장 최근 요청만 처리하도록 보장
  const requestIdRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 이전 debounce 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 현재 요청 ID 증가
    const currentRequestId = ++requestIdRef.current;

    const _controller = new Controller({
      modelName: "SleepRecord",
      modelId: "sleep_record",
    });

    const fetchData = async () => {
      // 이미 새로운 요청이 시작되었으면 무시
      if (currentRequestId !== requestIdRef.current) return;

      try {
        setLoading(true);
        setError(null);
        setNeedsFitbitLogin(false);

        // 1. 서버에서 먼저 조회
        const serverRes = await _controller.findOne({
          SLEEP_DATE: dateStr,
        });

        // 요청 중 새로운 요청이 시작되었으면 무시
        if (currentRequestId !== requestIdRef.current) return;

        if (serverRes?.data?.data) {
          const parsed = parseServerSleep(serverRes.data.data);
          console.log("✅ 서버 데이터 파싱 결과:", parsed);
          setData(parsed);
          setLoading(false);
          return;
        }

        // 2. 서버에 없으면 Fitbit에서 동기화
        const accessToken = await getAccessToken();

        const memberId = await getMemberId();
        const syncRes = await controller.syncFromFitbit({
          SLEEP_DATE: dateStr,
          FITBIT_ACCESS_TOKEN: accessToken,
          APP_MEMBER_IDENTIFICATION_CODE: memberId,
        });
        console.log("🔄 Fitbit 동기화 응답:", syncRes?.data?.result);

        // 요청 중 새로운 요청이 시작되었으면 무시
        if (currentRequestId !== requestIdRef.current) return;

        if (syncRes?.data?.record) {
          const parsed = parseServerSleep(syncRes.data.record);
          console.log("✅ Fitbit 데이터 파싱 결과:", parsed);
          setData(parsed);
        } else {
          console.log("⚠️ Fitbit 데이터 없음");
          setData(null);
        }
      } catch (e) {
        console.log("❌ 에러 발생:", e);
        // 요청 중 새로운 요청이 시작되었으면 무시
        if (currentRequestId !== requestIdRef.current) return;

        const errorMessage = e instanceof Error ? e.message : "데이터 로드 실패";
        setError(errorMessage);
        // Fitbit 로그인이 필요한 경우 플래그 설정
        if (errorMessage.includes("로그인이 필요") || errorMessage.includes("다시 로그인")) {
          setNeedsFitbitLogin(true);
        }
      } finally {
        // 요청 중 새로운 요청이 시작되었으면 무시
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    // 200ms debounce 적용 - 빠른 연속 날짜 선택 시 마지막 것만 처리
    debounceTimerRef.current = setTimeout(fetchData, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [dateStr]);

  return { data, loading, error, needsFitbitLogin };
};

// 날짜 범위 수면 데이터 (StatsScreen용)
export const useFitbitSleepByRange = (startDate: string, endDate: string) => {
  const [data, setData] = useState<ParsedSleepData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const memberId = await getMemberId();
        const res = await controller.getByRange({
          APP_MEMBER_IDENTIFICATION_CODE: memberId,
          START_DATE: startDate,
          END_DATE: endDate,
        });

        console.log("📊 범위 조회 응답:", res);

        if (res?.data?.result?.length > 0) {
          const parsed = res.data.result.map(parseServerSleep);
          console.log("✅ 범위 데이터 파싱 결과:", parsed);
          setData(parsed);
        } else {
          console.log("⚠️ 범위 데이터 없음");
          setData([]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return { data, loading, error };
};
