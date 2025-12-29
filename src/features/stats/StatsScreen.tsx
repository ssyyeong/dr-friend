import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Dimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, {
  Rect,
  Line,
  Circle,
  Text as SvgText,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WhiteMoonSvg from "../../../assets/icon/white-moon.svg";
import ShieldSvg from "../../../assets/icon/shield.svg";
import HelpSvg from "../../../assets/icon/help.svg";
import RecordSvg from "../../../assets/image/record.svg";

// =====================
// Layout / Styles
// =====================

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  padding: 18px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0 10px 0;
`;

const NavButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const MonthTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const SummarySection = styled.View`
  margin-top: 8px;
  margin-bottom: 16px;
  align-items: center;
  padding: 32px 4px;
`;

const SummaryTitle = styled.View`
  margin-bottom: 8px;
  align-items: center;
`;

const SummaryText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SummarySub = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 28.8px;
  text-align: center;
`;

const GradientTextContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
`;

const CardTopRow = styled.View`
  gap: 8px;
`;

const MetricBox = styled.View`
  flex: 1;
  justify-content: space-between;
  flex-direction: row;
`;

const CardLabel = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const CardValue = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const BadgeRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const QualityBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: 999px;
  padding: 4px 8px;
`;

const QualityBadgeText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: 700;
`;

const Divider = styled.View`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.06);
  margin: 14px 0;
`;

const ComparisonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ComparisonLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const ComparisonRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ComparisonText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const ComparisonStrong = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
`;

const ProgressCard = styled.View`
  align-items: center;
  padding: 20px;
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: 12px;
`;
const ProgressHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const ProgressTitle = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ProgressSub = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const ProgressSubText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar2Container = styled.View`
  height: 8px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 20px;
`;

const ProgressBarContainer = styled.View`
  height: 24px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 32px;
`;

const ProgressBar = styled.View<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
`;

const ChartCardTitle = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.gray200};
  font-weight: 700;
`;

const ChartTitleStrong = styled.Text`
  color: ${({ theme }) => theme.colors.text};
`;

const ChartBox = styled.View`
  background-color: rgba(9, 24, 44, 0.45);
  border-radius: 14px;
  padding: 10px;
`;

const XAxisRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 6px 6px 0 6px;
`;

const XLabel = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Top3Title = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
  margin-bottom: 12px;
`;

const Top3Item = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
`;

const Top3Icon = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: rgba(9, 24, 44, 0.45);
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const Top3Label = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  font-weight: 700;
`;

const Top3Count = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 800;
`;

// =====================
// Types
// =====================

interface SleepData {
  quality: number;
  totalSleepTime: { hours: number; minutes: number };
  timeInBed: { hours: number; minutes: number };
  sleepGoal: { hours: number; minutes: number };
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
  snoringSegments: Array<{ time: string; isPlaying?: boolean }>;
  coaching: string;
  memoOptions: string[];
  diary: string;
}
type SleepDataMap = Record<string, SleepData>;

const STORAGE_KEY = "@diary_sleep_data";
const screenWidth = Dimensions.get("window").width;

// =====================
// Component
// =====================

const StatsScreen = () => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sleepDataMap, setSleepDataMap] = useState<SleepDataMap>({});

  useEffect(() => {
    const loadSleepData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setSleepDataMap(JSON.parse(stored));
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      }
    };
    loadSleepData();
  }, []);

  const getDateKey = (date: Date) => date.toISOString().split("T")[0];

  // 현재 날짜 가져오기 (오늘까지만 표시하기 위해)
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const getCurrentMonthSleepData = useCallback((): SleepData[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // 현재 월이 오늘의 월과 같으면 오늘까지만, 아니면 해당 월의 마지막 날까지
    const isCurrentMonth =
      year === today.getFullYear() && month === today.getMonth();
    const maxDay = isCurrentMonth ? today.getDate() : daysInMonth;

    const data: SleepData[] = [];
    for (let i = 1; i <= maxDay; i++) {
      const dateKey = getDateKey(new Date(year, month, i));
      const existing = sleepDataMap[dateKey];

      if (existing) data.push(existing);
      else {
        const baseQuality = 65 + (i % 20);
        const baseHours = 6 + Math.floor(i % 3);
        const baseMinutes = 30 + (i % 30);

        data.push({
          quality: Math.min(100, baseQuality),
          totalSleepTime: { hours: baseHours, minutes: baseMinutes },
          timeInBed: { hours: baseHours + 1, minutes: (baseMinutes + 20) % 60 },
          sleepGoal: { hours: 8, minutes: 0 },
          bedtime: { hour: 11 + (i % 2), minute: 30 + (i % 30), ampm: "PM" },
          wakeTime: { hour: 7 + (i % 2), minute: (i * 2) % 60, ampm: "AM" },
          analysis: {
            regularity: `${75 + (i % 15)}%`,
            heartRate: `${60 + (i % 10)}`,
            temperatureChange: `${1 + (i % 2)}°C`,
            temperatureStability: `36°C / ${45 + (i % 10)}%`,
            sleepLatency: `${20 + (i % 30)}분`,
            deepSleep: `${20 + (i % 15)}%`,
            lightSleep: `${45 + (i % 15)}%`,
            remSleep: `${20 + (i % 15)}%`,
            awakeTime: `${15 + (i % 10)}%`,
            snoring: `${2 + (i % 2)}시간 ${15 + (i % 45)}분`,
          },
          snoringSegments: [],
          coaching: "",
          memoOptions: [],
          diary: "",
        });
      }
    }
    return data;
  }, [currentMonth, sleepDataMap, today]);

  const monthSleepData = getCurrentMonthSleepData();
  const measuredDays = monthSleepData.filter((d) => d.quality > 0).length;

  const averageData = useMemo(() => {
    if (measuredDays === 0) return null;
    const valid = monthSleepData.filter((d) => d.quality > 0);

    const avgQuality = valid.reduce((s, d) => s + d.quality, 0) / valid.length;

    const totalSleepMinutes = valid.reduce(
      (s, d) => s + d.totalSleepTime.hours * 60 + d.totalSleepTime.minutes,
      0
    );
    const avgSleepMin = Math.floor(totalSleepMinutes / valid.length);
    const avgSleepHours = Math.floor(avgSleepMin / 60);
    const avgSleepMinutes = avgSleepMin % 60;

    const totalSleepHours = Math.floor(totalSleepMinutes / 60);
    const totalSleepMins = totalSleepMinutes % 60;

    const parsePct = (s: string) => parseFloat(s.replace("%", ""));
    const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ""));

    const avgRegularity =
      valid.reduce((s, d) => s + parsePct(d.analysis.regularity), 0) /
      valid.length;

    const avgSleepLatency =
      valid.reduce((s, d) => s + parseNum(d.analysis.sleepLatency), 0) /
      valid.length;

    const avgDeepSleep =
      valid.reduce((s, d) => s + parsePct(d.analysis.deepSleep), 0) /
      valid.length;

    const bedtimeMinAvg = Math.round(
      valid.reduce((s, d) => {
        let m = d.bedtime.hour * 60 + d.bedtime.minute;
        if (d.bedtime.ampm === "PM" && d.bedtime.hour !== 12) m += 12 * 60;
        if (d.bedtime.ampm === "AM" && d.bedtime.hour === 12) m -= 12 * 60;
        return s + m;
      }, 0) / valid.length
    );

    const wakeMinAvg = Math.round(
      valid.reduce((s, d) => {
        let m = d.wakeTime.hour * 60 + d.wakeTime.minute;
        if (d.wakeTime.ampm === "PM" && d.wakeTime.hour !== 12) m += 12 * 60;
        if (d.wakeTime.ampm === "AM" && d.wakeTime.hour === 12) m -= 12 * 60;
        return s + m;
      }, 0) / valid.length
    );

    const deepSleepTotalMin = Math.round((avgDeepSleep / 100) * avgSleepMin);
    const deepSleepHours = Math.floor(deepSleepTotalMin / 60);
    const deepSleepMinutes = deepSleepTotalMin % 60;

    return {
      quality: Math.round(avgQuality),
      totalSleepTime: { hours: totalSleepHours, minutes: totalSleepMins },
      avgSleepTime: { hours: avgSleepHours, minutes: avgSleepMinutes },
      regularity: Math.round(avgRegularity),
      sleepLatency: Math.round(avgSleepLatency),
      deepSleep: avgDeepSleep,
      deepSleepTime: { hours: deepSleepHours, minutes: deepSleepMinutes },
      bedtimeMinAvg,
      wakeMinAvg,
      dailyData: valid.map((d, idx) => ({
        day: idx + 1,
        sleepHours: d.totalSleepTime.hours + d.totalSleepTime.minutes / 60,
        regularity: parsePct(d.analysis.regularity),
        wakeMin: (() => {
          let m = d.wakeTime.hour * 60 + d.wakeTime.minute;
          if (d.wakeTime.ampm === "PM" && d.wakeTime.hour !== 12) m += 12 * 60;
          if (d.wakeTime.ampm === "AM" && d.wakeTime.hour === 12) m -= 12 * 60;
          return m;
        })(),
        bedMin: (() => {
          let m = d.bedtime.hour * 60 + d.bedtime.minute;
          if (d.bedtime.ampm === "PM" && d.bedtime.hour !== 12) m += 12 * 60;
          if (d.bedtime.ampm === "AM" && d.bedtime.hour === 12) m -= 12 * 60;
          return m;
        })(),
        sleepLatency: parseNum(d.analysis.sleepLatency),
        deepSleepHours:
          (parsePct(d.analysis.deepSleep) / 100) *
          (d.totalSleepTime.hours + d.totalSleepTime.minutes / 60),
      })),
    };
  }, [monthSleepData, measuredDays]);

  if (!averageData) {
    return (
      <Screen>
        <Content>
          <MonthTitle>데이터가 없습니다</MonthTitle>
        </Content>
      </Screen>
    );
  }

  const formatMonthOnly = (date: Date) => `${date.getMonth() + 1}월`;

  // 현재 월인지 확인
  const isCurrentMonth = useMemo(() => {
    return (
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth()
    );
  }, [currentMonth, today]);

  // 다음 월로 이동 가능한지 확인 (미래 월로는 이동 불가)
  const canGoNextMonth = useMemo(() => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return (
      nextMonth.getFullYear() < today.getFullYear() ||
      (nextMonth.getFullYear() === today.getFullYear() &&
        nextMonth.getMonth() <= today.getMonth())
    );
  }, [currentMonth, today]);

  const handlePrevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };
  const handleNextMonth = () => {
    if (!canGoNextMonth) return;
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  // 스샷처럼 예시값
  const monthComparison = -5;

  const measurementProgress = 37;
  const measurementGoal = 50;
  const measurementProgressPercent =
    (measurementProgress / measurementGoal) * 100;

  const goalAchievements = averageData.dailyData.filter(
    (d) => d.sleepHours >= 8
  ).length;
  const goalProgressPercent = measuredDays
    ? (goalAchievements / measuredDays) * 100
    : 0;

  const morningMoodCount = 15; // 스샷 느낌으로 예시
  const morningMoodProgressPercent = 100;

  // ---------- Chart Helpers (스샷 느낌: 그리드 + 우측 Y라벨 + 1/10/19/28) ----------
  const commonChart = {
    w: screenWidth - 18 * 2 - 16 * 2, // content padding + card padding
    h: 130,
    padX: 10,
    padY: 10,
    rightAxis: 26,
    bottomAxis: 18,
    gridLines: 4,
  };

  const renderBarChart = (
    values: number[],
    maxValue: number,
    yLabelsRight: string[]
  ) => {
    const { w, h, padX, padY, rightAxis, bottomAxis, gridLines } = commonChart;

    const chartW = w - padX * 2 - rightAxis;
    const chartH = h - padY * 2 - bottomAxis;

    const safe = values.length ? values : [0];
    const barGap = 3;
    const barW = Math.max(2, chartW / safe.length - barGap);

    const yOf = (v: number) => padY + chartH - (v / maxValue) * chartH;

    return (
      <ChartBox>
        <Svg width={w} height={h}>
          {/* grid */}
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = padY + (chartH / gridLines) * i;
            return (
              <Line
                key={`g-${i}`}
                x1={padX}
                x2={padX + chartW}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            );
          })}

          {/* bars */}
          {safe.map((v, i) => {
            const x = padX + i * (barW + barGap);
            const y = yOf(v);
            const bh = padY + chartH - y;
            // 값에 따라 투명도 조정: 0에 가까우면 거의 보이지 않게, 높은 값은 더 불투명
            const normalizedValue = v / maxValue;
            let opacity = 1;
            if (v < 0.5) {
              // 매우 낮은 값은 거의 투명
              opacity = Math.max(0.05, v * 0.2);
            } else {
              // 일반적인 값은 정상 투명도
              opacity = Math.max(0.4, Math.min(1, 0.6 + normalizedValue * 0.4));
            }
            return (
              <Rect
                key={`b-${i}`}
                x={x}
                y={y}
                width={barW}
                height={Math.max(0.5, bh)}
                rx={2}
                fill={theme.colors.primary}
                opacity={opacity}
              />
            );
          })}

          {/* right y labels */}
          {yLabelsRight.map((label, i) => {
            const y = padY + (chartH / (yLabelsRight.length - 1)) * i;
            return (
              <SvgText
                key={`yl-${i}`}
                x={padX + chartW + 6}
                y={y + 3}
                fontSize="10"
                fill={theme.colors.textSecondary}
              >
                {label}
              </SvgText>
            );
          })}
        </Svg>

        <XAxisRow>
          <XLabel>1</XLabel>
          <XLabel>10</XLabel>
          <XLabel>19</XLabel>
          <XLabel>28</XLabel>
        </XAxisRow>
      </ChartBox>
    );
  };

  const renderLineChart = (
    values: number[],
    minV: number,
    maxV: number,
    yLabelsRight: string[]
  ) => {
    const { w, h, padX, padY, rightAxis, bottomAxis, gridLines } = commonChart;

    const chartW = w - padX * 2 - rightAxis;
    const chartH = h - padY * 2 - bottomAxis;

    const safe = values.length ? values : [0];
    const stepX = safe.length > 1 ? chartW / (safe.length - 1) : 0;

    const yOf = (v: number) => {
      const denom = maxV - minV || 1;
      const t = (v - minV) / denom;
      return padY + chartH - t * chartH;
    };

    // 라인 경로
    let d = "";
    safe.forEach((v, i) => {
      const x = padX + i * stepX;
      const y = yOf(v);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });

    // 영역 채우기 경로 (라인 + 하단 닫기)
    const bottomY = padY + chartH;
    const areaPath = `${d} L ${
      padX + (safe.length - 1) * stepX
    } ${bottomY} L ${padX} ${bottomY} Z`;

    return (
      <ChartBox>
        <Svg width={w} height={h}>
          <Defs>
            <SvgLinearGradient
              id="areaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#9D7AFF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#9D7AFF" stopOpacity="0.05" />
            </SvgLinearGradient>
          </Defs>

          {/* grid */}
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = padY + (chartH / gridLines) * i;
            return (
              <Line
                key={`g-${i}`}
                x1={padX}
                x2={padX + chartW}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            );
          })}

          {/* area fill */}
          <Path d={areaPath} fill="url(#areaGradient)" />

          {/* line */}
          <Path
            d={d}
            fill="none"
            stroke="#9D7AFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* points */}
          {safe.map((v, i) => {
            const x = padX + i * stepX;
            const y = yOf(v);
            return (
              <Circle
                key={`p-${i}`}
                cx={x}
                cy={y}
                r={4}
                fill="#FFFFFF"
                stroke="#9D7AFF"
                strokeWidth={2}
              />
            );
          })}

          {/* right y labels */}
          {yLabelsRight.map((label, i) => {
            const y = padY + (chartH / (yLabelsRight.length - 1)) * i;
            return (
              <SvgText
                key={`yl-${i}`}
                x={padX + chartW + 6}
                y={y + 3}
                fontSize="10"
                fill={theme.colors.textSecondary}
              >
                {label}
              </SvgText>
            );
          })}
        </Svg>

        <XAxisRow>
          <XLabel>1</XLabel>
          <XLabel>10</XLabel>
          <XLabel>19</XLabel>
          <XLabel>28</XLabel>
        </XAxisRow>
      </ChartBox>
    );
  };

  const renderComparisonMini = () => {
    const chartWidth = 120;
    const chartHeight = 70;
    const barWidth = 24;
    const maxHeight = 45;
    const spacing = 60;

    const prevH = maxHeight;
    const curH = maxHeight * 0.95;

    const bar1X = (chartWidth - spacing - barWidth * 2) / 2;
    const bar2X = bar1X + barWidth + spacing;

    // 이전 월 계산
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthText = formatMonthOnly(prevMonth);
    const currentMonthText = formatMonthOnly(currentMonth);

    return (
      <View style={{ width: "100%", alignItems: "center", marginVertical: 32 }}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* 이전 월 바 */}
          <Rect
            x={bar1X}
            y={chartHeight - prevH - 12}
            width={barWidth}
            height={prevH}
            rx={3}
            fill="#9D7AFF"
          />
          <Circle
            cx={bar1X + barWidth / 2}
            cy={chartHeight - prevH - 12}
            r={3.5}
            fill="#fff"
          />
          <SvgText
            x={bar1X + barWidth / 2}
            y={chartHeight - 2}
            fontSize="10"
            fill={theme.colors.textSecondary}
            textAnchor="middle"
          >
            {prevMonthText}
          </SvgText>

          {/* 현재 월 바 */}
          <Rect
            x={bar2X}
            y={chartHeight - curH - 12}
            width={barWidth}
            height={curH}
            rx={3}
            fill={theme.colors.primary}
          />
          <Circle
            cx={bar2X + barWidth / 2}
            cy={chartHeight - curH - 12}
            r={3.5}
            fill="#fff"
          />
          <SvgText
            x={bar2X + barWidth / 2}
            y={chartHeight - 2}
            fontSize="10"
            fill={theme.colors.textSecondary}
            textAnchor="middle"
          >
            {currentMonthText}
          </SvgText>

          {/* 연결선 */}
          <Line
            x1={bar1X + barWidth}
            y1={chartHeight - prevH - 12}
            x2={bar2X}
            y2={chartHeight - curH - 12}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={1.5}
            strokeDasharray="2,2"
          />
        </Svg>
      </View>
    );
  };

  // Top3
  const top3Records = [
    { label: "커피", count: 12, iconName: "cafe" as const },
    { label: "운동", count: 8, iconName: "fitness" as const },
    { label: "따듯한 목욕", count: 3, iconName: "water" as const },
  ];

  return (
    <Screen>
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          {/* 헤더 */}
          <Header>
            <NavButton onPress={handlePrevMonth} activeOpacity={0.7}>
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.colors.text}
              />
            </NavButton>
            <MonthTitle>{formatMonthOnly(currentMonth)}</MonthTitle>
            <NavButton
              onPress={handleNextMonth}
              activeOpacity={canGoNextMonth ? 0.7 : 1}
              disabled={!canGoNextMonth}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={
                  canGoNextMonth
                    ? theme.colors.text
                    : theme.colors.textSecondary
                }
              />
            </NavButton>
          </Header>

          {/* 상단 요약 (가운데 정렬) */}
          <SummarySection>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <SummaryText style={{ marginRight: 4 }}>
                {formatMonthOnly(currentMonth)}
              </SummaryText>
              <GradientTextContainer>
                <Svg height="28" width={70}>
                  <Defs>
                    <SvgLinearGradient
                      id="avgGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <Stop offset="0%" stopColor="#7353FF" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#25C3FB" stopOpacity="1" />
                    </SvgLinearGradient>
                  </Defs>
                  <SvgText
                    x="0"
                    y="23"
                    fontSize="22"
                    fontWeight="700"
                    fill="url(#avgGradient)"
                  >
                    총 {measuredDays}일
                  </SvgText>
                </Svg>
              </GradientTextContainer>
              <SummaryText style={{ marginLeft: 4 }}>
                수면 측정 완료
              </SummaryText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <SummaryText style={{ marginRight: 4 }}></SummaryText>
              <GradientTextContainer>
                <Svg height="28" width={190}>
                  <Defs>
                    <SvgLinearGradient
                      id="avgGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <Stop offset="0%" stopColor="#7353FF" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#25C3FB" stopOpacity="1" />
                    </SvgLinearGradient>
                  </Defs>
                  <SvgText
                    x="0"
                    y="23"
                    fontSize="22"
                    fontWeight="700"
                    fill="url(#avgGradient)"
                  >
                    하루 평균 {averageData.avgSleepTime.hours}시간{" "}
                    {averageData.avgSleepTime.minutes}분
                  </SvgText>
                </Svg>
              </GradientTextContainer>
              <SummaryText style={{ marginLeft: 4 }}>수면</SummaryText>
            </View>
            <SummarySub style={{ marginTop: 16 }}>
              좋은 수면을 유지하고 있지만,
              {"\n"}지난달보다 조금 아쉽습니다.
              {"\n"}
              추천 루틴을 유지하면 금세 회복됩니다.
            </SummarySub>
          </SummarySection>

          {/* 첫 카드: 총 수면 / 평균 점수 / 전월대비 */}
          <Card>
            <CardTopRow>
              <MetricBox>
                <CardLabel>총 수면 시간</CardLabel>
                <CardValue>
                  {averageData.totalSleepTime.hours}시간{" "}
                  {averageData.totalSleepTime.minutes}분
                </CardValue>
              </MetricBox>

              <MetricBox style={{ alignItems: "flex-end" }}>
                <CardLabel>평균 수면 품질</CardLabel>
                <BadgeRow>
                  <CardValue>{averageData.quality}%</CardValue>
                  <QualityBadge>
                    <QualityBadgeText>Good</QualityBadgeText>
                  </QualityBadge>
                </BadgeRow>
              </MetricBox>
              <MetricBox>
                <CardLabel>전월 대비</CardLabel>
                <ComparisonRight>
                  <WhiteMoonSvg width={16} height={16} />
                  <ComparisonText>소폭 하락</ComparisonText>
                  <ComparisonStrong>{monthComparison}%</ComparisonStrong>
                </ComparisonRight>
              </MetricBox>
              {renderComparisonMini()}
            </CardTopRow>
            {/* 측정 진행도 카드 */}
            <ProgressCard>
              <ProgressHeader>
                <ProgressTitle>
                  <GradientTextContainer>
                    <Svg height="20" width={100}>
                      <Defs>
                        <SvgLinearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <Stop
                            offset="0%"
                            stopColor="#7353FF"
                            stopOpacity="1"
                          />
                          <Stop
                            offset="100%"
                            stopColor="#25C3FB"
                            stopOpacity="1"
                          />
                        </SvgLinearGradient>
                      </Defs>
                      <SvgText
                        x="0"
                        y="15"
                        fontSize="14"
                        fontWeight="700"
                        fill="url(#progressGradient)"
                      >
                        총 {measurementProgress}회 수면 측정
                      </SvgText>
                    </Svg>
                  </GradientTextContainer>
                  <ShieldSvg width={21} height={21} />
                </ProgressTitle>
              </ProgressHeader>
              <ProgressSub>
                <HelpSvg width={20} height={20} />
                <ProgressSubText>
                  측정 미션 성공까지 {measurementGoal - measurementProgress}회
                  남음
                </ProgressSubText>
              </ProgressSub>
              <ProgressBar2Container>
                <ProgressBar width={measurementProgressPercent} />
              </ProgressBar2Container>
            </ProgressCard>
          </Card>

          {/* 차트 카드들 */}
          <Card>
            <ChartCardTitle>
              하루 평균 수면시간은{" "}
              <ChartTitleStrong>
                {averageData.avgSleepTime.hours}시간{" "}
                {averageData.avgSleepTime.minutes}분
              </ChartTitleStrong>
              입니다.
            </ChartCardTitle>
            {useMemo(() => {
              // 28일치 데이터 생성 (자연스러운 패턴)
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const maxDays = Math.min(28, daysInMonth);

              // 날짜 기반 결정적 랜덤 값 생성 함수
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // 평균값을 기반으로 자연스러운 변동 생성
              const avgValue =
                averageData.avgSleepTime.hours +
                averageData.avgSleepTime.minutes / 60;

              const chartData = Array.from({ length: maxDays }, (_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                const existing = sleepDataMap[dateKey];

                if (existing) {
                  // 실제 데이터가 있으면 사용
                  return (
                    existing.totalSleepTime.hours +
                    existing.totalSleepTime.minutes / 60
                  );
                }

                // 날짜 기반 시드 생성
                const seed = year * 10000 + month * 100 + day;
                const r1 = seededRandom(seed);
                const r2 = seededRandom(seed + 1);

                // 데이터가 없는 날짜는 자연스러운 패턴으로 생성
                // 후반부(19일 이후)는 더 낮은 확률로 데이터 있음
                if (day > 19) {
                  // 후반부는 대부분 데이터 없음 (매우 낮은 값 또는 0)
                  return r1 < 0.15 ? r2 * 1.5 : 0;
                } else if (day > 10) {
                  // 중반부는 중간 확률, 평균값 주변 변동
                  return r1 < 0.5
                    ? Math.max(0, avgValue - 2 + r2 * 4)
                    : r2 * 1.5;
                } else {
                  // 초반부는 대부분 데이터 있음, 평균값 주변 변동
                  return r1 < 0.7
                    ? Math.max(0, avgValue - 1.5 + r2 * 3)
                    : r2 * 2;
                }
              });

              return renderBarChart(chartData, 10, [
                "8h",
                "6h",
                "4h",
                "2h",
                "0h",
              ]);
            }, [currentMonth, sleepDataMap, averageData])}
          </Card>

          <Card>
            <ChartCardTitle>
              평균 수면 규칙성은{" "}
              <ChartTitleStrong>{averageData.regularity}%</ChartTitleStrong>{" "}
              입니다.
            </ChartCardTitle>
            {useMemo(() => {
              // 28일치 데이터 생성 (자연스러운 패턴)
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const maxDays = Math.min(28, daysInMonth);

              // 날짜 기반 결정적 랜덤 값 생성 함수
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // 평균값을 기반으로 자연스러운 변동 생성
              const avgValue =
                averageData.avgSleepTime.hours +
                averageData.avgSleepTime.minutes / 60;

              const chartData = Array.from({ length: maxDays }, (_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                const existing = sleepDataMap[dateKey];

                if (existing) {
                  // 실제 데이터가 있으면 사용
                  return (
                    existing.totalSleepTime.hours +
                    existing.totalSleepTime.minutes / 60
                  );
                }

                // 날짜 기반 시드 생성
                const seed = year * 10000 + month * 100 + day;
                const r1 = seededRandom(seed);
                const r2 = seededRandom(seed + 1);

                // 데이터가 없는 날짜는 자연스러운 패턴으로 생성
                // 후반부(19일 이후)는 더 낮은 확률로 데이터 있음
                if (day > 19) {
                  // 후반부는 대부분 데이터 없음 (매우 낮은 값 또는 0)
                  return r1 < 0.15 ? r2 * 1.5 : 0;
                } else if (day > 10) {
                  // 중반부는 중간 확률, 평균값 주변 변동
                  return r1 < 0.5
                    ? Math.max(0, avgValue - 2 + r2 * 4)
                    : r2 * 1.5;
                } else {
                  // 초반부는 대부분 데이터 있음, 평균값 주변 변동
                  return r1 < 0.7
                    ? Math.max(0, avgValue - 1.5 + r2 * 3)
                    : r2 * 2;
                }
              });

              return renderBarChart(chartData, 10, [
                "8h",
                "6h",
                "4h",
                "2h",
                "0h",
              ]);
            }, [currentMonth, sleepDataMap, averageData])}
          </Card>

          <Card>
            <ChartCardTitle>
              평균 기상 시간은{" "}
              <ChartTitleStrong>
                {(() => {
                  const hours = Math.floor(averageData.wakeMinAvg / 60);
                  const minutes = averageData.wakeMinAvg % 60;
                  const displayHour =
                    hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
                  const ampm = hours >= 12 ? "오후" : "오전";
                  return `${ampm} ${displayHour}시 ${minutes}분`;
                })()}
              </ChartTitleStrong>{" "}
              입니다.
            </ChartCardTitle>
            {useMemo(() => {
              // 28일치 기상 시간 데이터 생성 (자연스러운 패턴)
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const maxDays = Math.min(28, daysInMonth);

              // 실제 데이터를 날짜별로 매핑
              const dataByDate = new Map<string, number>();
              const validData = monthSleepData.filter((d) => d.quality > 0);
              validData.forEach((d, idx) => {
                const day = idx + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                if (sleepDataMap[dateKey]) {
                  dataByDate.set(
                    dateKey,
                    averageData.dailyData[idx]?.wakeMin || 0
                  );
                }
              });

              // 날짜 기반 결정적 랜덤 값 생성 함수
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // 평균 기상 시간을 기준으로 자연스러운 변동 생성
              const avgWakeMin = averageData.wakeMinAvg;

              const chartData = Array.from({ length: maxDays }, (_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                const existingData = dataByDate.get(dateKey);

                if (existingData && existingData > 0) {
                  // 실제 데이터가 있으면 사용
                  return existingData;
                }

                // 날짜 기반 시드 생성
                const seed = year * 10000 + month * 100 + day;
                const r1 = seededRandom(seed);
                const r2 = seededRandom(seed + 1);

                // 데이터가 없는 날짜는 자연스러운 패턴으로 생성
                // 평균값 주변으로 변동 (약 ±2시간 범위)
                const variation = (r1 - 0.5) * 240; // ±120분 변동
                const baseValue = avgWakeMin + variation;

                // 후반부는 더 큰 변동 가능
                if (day > 19) {
                  const extraVariation = (r2 - 0.5) * 180; // 추가 변동
                  return Math.max(
                    360,
                    Math.min(720, baseValue + extraVariation)
                  );
                } else if (day > 10) {
                  return Math.max(360, Math.min(720, baseValue));
                } else {
                  // 초반부는 평균값에 가깝게
                  return Math.max(
                    360,
                    Math.min(720, avgWakeMin + (r1 - 0.5) * 120)
                  );
                }
              });

              // 최소/최대값 계산 (6am ~ 12pm 범위)
              const validValues = chartData.filter((v) => v > 0);
              const minValue =
                validValues.length > 0
                  ? Math.max(360, Math.min(...validValues))
                  : 360;
              const maxValue =
                validValues.length > 0
                  ? Math.min(720, Math.max(...validValues))
                  : 720;

              return renderLineChart(chartData, minValue, maxValue, [
                "12pm",
                "11am",
                "10am",
                "9am",
                "8am",
                "7am",
                "6am",
              ]);
            }, [currentMonth, sleepDataMap, averageData, monthSleepData])}
          </Card>

          <Card>
            <ChartCardTitle>
              평균 취침 시간(분)은{" "}
              <ChartTitleStrong>{averageData.bedtimeMinAvg}분</ChartTitleStrong>{" "}
              입니다.
            </ChartCardTitle>
            {useMemo(() => {
              // 28일치 기상 시간 데이터 생성 (자연스러운 패턴)
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const maxDays = Math.min(28, daysInMonth);

              // 실제 데이터를 날짜별로 매핑
              const dataByDate = new Map<string, number>();
              const validData = monthSleepData.filter((d) => d.quality > 0);
              validData.forEach((d, idx) => {
                const day = idx + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                if (sleepDataMap[dateKey]) {
                  dataByDate.set(
                    dateKey,
                    averageData.dailyData[idx]?.wakeMin || 0
                  );
                }
              });

              // 날짜 기반 결정적 랜덤 값 생성 함수
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // 평균 기상 시간을 기준으로 자연스러운 변동 생성
              const avgWakeMin = averageData.wakeMinAvg;

              const chartData = Array.from({ length: maxDays }, (_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                const existingData = dataByDate.get(dateKey);

                if (existingData && existingData > 0) {
                  // 실제 데이터가 있으면 사용
                  return existingData;
                }

                // 날짜 기반 시드 생성
                const seed = year * 10000 + month * 100 + day;
                const r1 = seededRandom(seed);
                const r2 = seededRandom(seed + 1);

                // 데이터가 없는 날짜는 자연스러운 패턴으로 생성
                // 평균값 주변으로 변동 (약 ±2시간 범위)
                const variation = (r1 - 0.5) * 240; // ±120분 변동
                const baseValue = avgWakeMin + variation;

                // 후반부는 더 큰 변동 가능
                if (day > 19) {
                  const extraVariation = (r2 - 0.5) * 180; // 추가 변동
                  return Math.max(
                    360,
                    Math.min(720, baseValue + extraVariation)
                  );
                } else if (day > 10) {
                  return Math.max(360, Math.min(720, baseValue));
                } else {
                  // 초반부는 평균값에 가깝게
                  return Math.max(
                    360,
                    Math.min(720, avgWakeMin + (r1 - 0.5) * 120)
                  );
                }
              });

              // 최소/최대값 계산 (6am ~ 12pm 범위)
              const validValues = chartData.filter((v) => v > 0);
              const minValue =
                validValues.length > 0
                  ? Math.max(360, Math.min(...validValues))
                  : 360;
              const maxValue =
                validValues.length > 0
                  ? Math.min(720, Math.max(...validValues))
                  : 720;

              return renderLineChart(chartData, minValue, maxValue, [
                "12pm",
                "11am",
                "10am",
                "9am",
                "8am",
                "7am",
                "6am",
              ]);
            }, [currentMonth, sleepDataMap, averageData, monthSleepData])}
          </Card>

          <Card>
            <ChartCardTitle>
              평균 잠드는 데 걸리는 시간은{" "}
              <ChartTitleStrong>{averageData.sleepLatency}분</ChartTitleStrong>{" "}
              입니다.
            </ChartCardTitle>
            {useMemo(() => {
              // 28일치 데이터 생성 (자연스러운 패턴)
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const maxDays = Math.min(28, daysInMonth);

              // 날짜 기반 결정적 랜덤 값 생성 함수
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // 평균값을 기반으로 자연스러운 변동 생성
              const avgValue =
                averageData.avgSleepTime.hours +
                averageData.avgSleepTime.minutes / 60;

              const chartData = Array.from({ length: maxDays }, (_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                const existing = sleepDataMap[dateKey];

                if (existing) {
                  // 실제 데이터가 있으면 사용
                  return (
                    existing.totalSleepTime.hours +
                    existing.totalSleepTime.minutes / 60
                  );
                }

                // 날짜 기반 시드 생성
                const seed = year * 10000 + month * 100 + day;
                const r1 = seededRandom(seed);
                const r2 = seededRandom(seed + 1);

                // 데이터가 없는 날짜는 자연스러운 패턴으로 생성
                // 후반부(19일 이후)는 더 낮은 확률로 데이터 있음
                if (day > 19) {
                  // 후반부는 대부분 데이터 없음 (매우 낮은 값 또는 0)
                  return r1 < 0.15 ? r2 * 1.5 : 0;
                } else if (day > 10) {
                  // 중반부는 중간 확률, 평균값 주변 변동
                  return r1 < 0.5
                    ? Math.max(0, avgValue - 2 + r2 * 4)
                    : r2 * 1.5;
                } else {
                  // 초반부는 대부분 데이터 있음, 평균값 주변 변동
                  return r1 < 0.7
                    ? Math.max(0, avgValue - 1.5 + r2 * 3)
                    : r2 * 2;
                }
              });

              return renderBarChart(chartData, 10, [
                "8h",
                "6h",
                "4h",
                "2h",
                "0h",
              ]);
            }, [currentMonth, sleepDataMap, averageData])}
          </Card>

          <Card>
            <ChartCardTitle>
              평균 깊은 잠을 자는 시간은{" "}
              <ChartTitleStrong>
                {averageData.deepSleepTime.hours}시간{" "}
                {averageData.deepSleepTime.minutes}분
              </ChartTitleStrong>
              입니다.
            </ChartCardTitle>
            {useMemo(() => {
              // 28일치 데이터 생성 (자연스러운 패턴)
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const maxDays = Math.min(28, daysInMonth);

              // 날짜 기반 결정적 랜덤 값 생성 함수
              const seededRandom = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
              };

              // 평균값을 기반으로 자연스러운 변동 생성
              const avgValue =
                averageData.avgSleepTime.hours +
                averageData.avgSleepTime.minutes / 60;

              const chartData = Array.from({ length: maxDays }, (_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(new Date(year, month, day));
                const existing = sleepDataMap[dateKey];

                if (existing) {
                  // 실제 데이터가 있으면 사용
                  return (
                    existing.totalSleepTime.hours +
                    existing.totalSleepTime.minutes / 60
                  );
                }

                // 날짜 기반 시드 생성
                const seed = year * 10000 + month * 100 + day;
                const r1 = seededRandom(seed);
                const r2 = seededRandom(seed + 1);

                // 데이터가 없는 날짜는 자연스러운 패턴으로 생성
                // 후반부(19일 이후)는 더 낮은 확률로 데이터 있음
                if (day > 19) {
                  // 후반부는 대부분 데이터 없음 (매우 낮은 값 또는 0)
                  return r1 < 0.15 ? r2 * 1.5 : 0;
                } else if (day > 10) {
                  // 중반부는 중간 확률, 평균값 주변 변동
                  return r1 < 0.5
                    ? Math.max(0, avgValue - 2 + r2 * 4)
                    : r2 * 1.5;
                } else {
                  // 초반부는 대부분 데이터 있음, 평균값 주변 변동
                  return r1 < 0.7
                    ? Math.max(0, avgValue - 1.5 + r2 * 3)
                    : r2 * 2;
                }
              });

              return renderBarChart(chartData, 10, [
                "8h",
                "6h",
                "4h",
                "2h",
                "0h",
              ]);
            }, [currentMonth, sleepDataMap, averageData])}
          </Card>

          {/* 목표 달성 / 아침 기분 (스샷처럼 카드로) */}
          <Card>
            <ChartCardTitle>
              수면 목표 8시간을 한달{" "}
              <ChartTitleStrong>{goalAchievements}회</ChartTitleStrong>{" "}
              달성했습니다.
            </ChartCardTitle>
            <ProgressBarContainer>
              <ProgressBar width={goalProgressPercent} />
            </ProgressBarContainer>
          </Card>

          <Card>
            <ChartCardTitle>
              맑은 기분으로 깨어난 아침,{" "}
              <ChartTitleStrong>{morningMoodCount}회</ChartTitleStrong>, 당신의
              수면이 더 건강해지고 있습니다.
            </ChartCardTitle>
            <ProgressBarContainer>
              <ProgressBar width={morningMoodProgressPercent} />
            </ProgressBarContainer>
          </Card>

          {/* Record SVG */}
          <View style={{ width: "100%", height: "100%" }}>
            <RecordSvg />
          </View>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default StatsScreen;
