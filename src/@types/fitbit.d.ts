export interface FitbitTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user_id: string;
  scope: string;
}

export interface FitbitAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 기존 FitbitTokens, FitbitAuthState 아래에 추가

export interface FitbitSleepLevel {
  dateTime: string;
  level: "deep" | "light" | "rem" | "wake";
  seconds: number;
}

export interface FitbitSleepLevelSummary {
  deep: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  light: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  rem: { count: number; minutes: number; thirtyDayAvgMinutes: number };
  wake: { count: number; minutes: number; thirtyDayAvgMinutes: number };
}

export interface FitbitSleepEntry {
  dateOfSleep: string;
  duration: number; // 밀리초
  efficiency: number; // 0-100
  startTime: string;
  endTime: string;
  minutesAsleep: number;
  minutesAwake: number;
  timeInBed: number;
  levels: {
    data: FitbitSleepLevel[];
    summary: FitbitSleepLevelSummary;
  };
}

export interface FitbitSleepResponse {
  sleep: FitbitSleepEntry[];
  summary: {
    totalMinutesAsleep: number;
    totalSleepRecords: number;
    totalTimeInBed: number;
    stages?: {
      deep: number;
      light: number;
      rem: number;
      wake: number;
    };
  };
}

// DiaryScreen/StatsScreen에서 쓸 파싱된 타입
export interface ParsedSleepData {
  quality: number;
  totalSleepTime: { hours: number; minutes: number };
  timeInBed: { hours: number; minutes: number };
  bedtime: { hour: number; minute: number; ampm: "AM" | "PM" };
  wakeTime: { hour: number; minute: number; ampm: "AM" | "PM" };
  analysis: {
    regularity: string;
    heartRate: string;
    temperatureChange: string;
    temperatureStability: string;
    sleepLatency: string;
    deepSleep: string;
    lightSleep: string;
    remSleep: string;
    awakeTime: string;
    snoring: string;
  };
  sleepLevels: FitbitSleepLevel[];
}
