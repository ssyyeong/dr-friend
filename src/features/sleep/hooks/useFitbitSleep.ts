import { useState, useEffect } from "react";
import { parseFitbitSleep } from "../../../services/fitbitSleep";
import { getAccessToken } from "../../../services/fitbitAuth";
import { ParsedSleepData } from "../../../@types/fitbit";
import SleepRecordController from "../../../services/SleepRecordController";
import Controller from "../../../services/controller";
import { getMemberId } from "../../../services/authService";

const controller = new SleepRecordController({ modelId: "sleep_record" });

// ✅ 서버에서 파싱된 데이터로 변환
const parseServerSleep = (record: any): ParsedSleepData => {
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

  useEffect(() => {
    const dateStr = date.toISOString().split("T")[0];
    const _controller = new Controller({
      modelName: "SleepRecord",
      modelId: "sleep_record",
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 서버에서 먼저 조회
        const serverRes = await _controller.findOne({
          SLEEP_DATE: dateStr,
        });

        if (serverRes?.data?.data) {
          setData(parseServerSleep(serverRes.data.data));
          return;
        }

        // 2. 서버에 없으면 Fitbit에서 동기화
        const accessToken = await getAccessToken();
        const syncRes = await controller.syncFromFitbit({
          SLEEP_DATE: dateStr,
          ACCESS_TOKEN: accessToken,
        });

        if (syncRes?.data?.record) {
          setData(parseServerSleep(syncRes.data.record));
        } else {
          setData(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date.toISOString().split("T")[0]]);

  return { data, loading, error };
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

        console.log(
          "getByRange 응답:",
          JSON.stringify(res?.data?.result, null, 2),
        ); // ✅ 추가

        if (res?.data?.result?.length > 0) {
          setData(res.data.result.map(parseServerSleep));
        } else {
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
