import { getAccessToken } from "./fitbitAuth";
import {
  FitbitSleepResponse,
  FitbitSleepEntry,
  ParsedSleepData,
} from "../@types/fitbit";

const BASE_URL = "https://api.fitbit.com/1.2/user/-";

const fetchWithAuth = async (endpoint: string): Promise<any> => {
  const token = await getAccessToken();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`API 오류: ${response.status}`);
  return response.json();
};

// 특정 날짜 수면 데이터
export const getSleepByDate = async (
  date: string, // 'YYYY-MM-DD'
): Promise<FitbitSleepResponse> => {
  return fetchWithAuth(`/sleep/date/${date}.json`);
};

// 날짜 범위 수면 데이터
export const getSleepByRange = async (
  startDate: string,
  endDate: string,
): Promise<FitbitSleepResponse> => {
  return fetchWithAuth(`/sleep/date/${startDate}/${endDate}.json`);
};

// Fitbit 응답 → DiaryScreen/StatsScreen 포맷으로 파싱
export const parseFitbitSleep = (entry: FitbitSleepEntry): ParsedSleepData => {
  const start = new Date(entry.startTime);
  const end = new Date(entry.endTime);

  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();

  const toAmPm = (hour: number): "AM" | "PM" => (hour >= 12 ? "PM" : "AM");
  const to12Hour = (hour: number) => hour % 12 || 12;

  const { summary } = entry.levels;

  const totalMinutes = entry.minutesAsleep;
  const deepMinutes = summary.deep?.minutes ?? 0;
  const lightMinutes = summary.light?.minutes ?? 0;
  const remMinutes = summary.rem?.minutes ?? 0;
  const wakeMinutes = summary.wake?.minutes ?? 0;

  const deepPct =
    totalMinutes > 0 ? Math.round((deepMinutes / totalMinutes) * 100) : 0;
  const lightPct =
    totalMinutes > 0 ? Math.round((lightMinutes / totalMinutes) * 100) : 0;
  const remPct =
    totalMinutes > 0 ? Math.round((remMinutes / totalMinutes) * 100) : 0;
  const wakePct =
    totalMinutes > 0 ? Math.round((wakeMinutes / totalMinutes) * 100) : 0;

  // 잠들기까지 걸린 시간: 취침~첫 번째 수면 단계
  const firstSleepData = entry.levels.data.find((d) => d.level !== "wake");
  const sleepLatencyMs = firstSleepData
    ? new Date(firstSleepData.dateTime).getTime() - start.getTime()
    : 0;
  const sleepLatencyMin = Math.round(sleepLatencyMs / 60000);

  return {
    quality: entry.efficiency,
    totalSleepTime: {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    },
    timeInBed: {
      hours: Math.floor(entry.timeInBed / 60),
      minutes: entry.timeInBed % 60,
    },
    bedtime: {
      hour: to12Hour(startHour),
      minute: startMinute,
      ampm: toAmPm(startHour),
    },
    wakeTime: {
      hour: to12Hour(endHour),
      minute: endMinute,
      ampm: toAmPm(endHour),
    },
    analysis: {
      regularity: "-", // Fitbit API 미제공 → 추후 계산 가능
      heartRate: "-", // heartrate scope 별도 API 필요
      temperatureChange: "-", // Fitbit API 미제공
      temperatureStability: "-", // Fitbit API 미제공
      sleepLatency: `${sleepLatencyMin}분`,
      deepSleep: `${deepPct}%`,
      lightSleep: `${lightPct}%`,
      remSleep: `${remPct}%`,
      awakeTime: `${wakePct}%`,
      snoring: "-", // 별도 기기 필요
    },
    sleepLevels: entry.levels.data,
  };
};
