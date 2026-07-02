import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useFitbitSleepByRange } from "../sleep/hooks/useFitbitSleep";
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
import WhiteMoonSvg from "../../../assets/icon/white-moon.svg";
import ShieldSvg from "../../../assets/icon/shield.svg";
import HelpSvg from "../../../assets/icon/help.svg";
import RecordSvg from "../../../assets/image/record.svg";

// =====================
// Styled Components
// =====================

const Screen = styled(SafeAreaView)`
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

const SummaryColorText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
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
  margin-bottom: 12px;
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

const screenWidth = Dimensions.get("window").width;

// =====================
// Component
// =====================

const StatsScreen = () => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [missionModalVisible, setMissionModalVisible] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(year, month + 1, 0).getDate()}`;

  // ✅ 전월 날짜 범위 계산
  const prevMonthDate = new Date(year, month - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();
  const prevStartDate = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-01`;
  const prevEndDate = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${new Date(prevYear, prevMonth + 1, 0).getDate()}`;

  const { data: fitbitMonthData, loading: fitbitLoading } =
    useFitbitSleepByRange(startDate, endDate);

  // ✅ 전월 데이터 가져오기
  const { data: fitbitPrevMonthData, loading: fitbitPrevLoading } =
    useFitbitSleepByRange(prevStartDate, prevEndDate);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const parsePct = (s: string) => {
    if (!s || s === "-") return 0;
    const val = parseFloat(s.replace("%", ""));
    return isNaN(val) ? 0 : val;
  };

  const parseNum = (s: string) => {
    if (!s || s === "-") return 0;
    const val = parseFloat(s.replace(/[^0-9.]/g, ""));
    return isNaN(val) ? 0 : val;
  };

  // ✅ fitbitMonthData 기반으로 평균 데이터 계산
  const averageData = useMemo(() => {
    if (!fitbitMonthData || fitbitMonthData.length === 0) return null;

    const valid = fitbitMonthData;
    const measuredDays = valid.length;

    const avgQuality = valid.reduce((s, d) => s + d.quality, 0) / measuredDays;

    const totalSleepMinutes = valid.reduce(
      (s, d) => s + d.totalSleepTime.hours * 60 + d.totalSleepTime.minutes,
      0,
    );
    const avgSleepMin = Math.floor(totalSleepMinutes / measuredDays);
    const avgSleepHours = Math.floor(avgSleepMin / 60);
    const avgSleepMinutes = avgSleepMin % 60;
    const totalSleepHours = Math.floor(totalSleepMinutes / 60);
    const totalSleepMins = totalSleepMinutes % 60;

    const avgDeepSleep =
      valid.reduce((s, d) => s + parsePct(d.analysis.deepSleep), 0) /
      measuredDays;

    const avgSleepLatency =
      valid.reduce((s, d) => s + parseNum(d.analysis.sleepLatency), 0) /
      measuredDays;

    const bedtimeMinAvg = Math.round(
      valid.reduce((s, d) => {
        let m = d.bedtime.hour * 60 + d.bedtime.minute;
        if (d.bedtime.ampm === "PM" && d.bedtime.hour !== 12) m += 12 * 60;
        if (d.bedtime.ampm === "AM" && d.bedtime.hour === 12) m -= 12 * 60;
        return s + m;
      }, 0) / measuredDays,
    );

    const wakeMinAvg = Math.round(
      valid.reduce((s, d) => {
        let m = d.wakeTime.hour * 60 + d.wakeTime.minute;
        if (d.wakeTime.ampm === "PM" && d.wakeTime.hour !== 12) m += 12 * 60;
        if (d.wakeTime.ampm === "AM" && d.wakeTime.hour === 12) m -= 12 * 60;
        return s + m;
      }, 0) / measuredDays,
    );

    const deepSleepTotalMin = Math.round((avgDeepSleep / 100) * avgSleepMin);
    const deepSleepHours = Math.floor(deepSleepTotalMin / 60);
    const deepSleepMinutes = deepSleepTotalMin % 60;

    return {
      measuredDays,
      quality: Math.round(avgQuality),
      totalSleepTime: { hours: totalSleepHours, minutes: totalSleepMins },
      avgSleepTime: { hours: avgSleepHours, minutes: avgSleepMinutes },
      sleepLatency: Math.round(avgSleepLatency),
      deepSleep: avgDeepSleep,
      deepSleepTime: { hours: deepSleepHours, minutes: deepSleepMinutes },
      bedtimeMinAvg,
      wakeMinAvg,
      // ✅ 일별 실제 데이터
      dailyData: valid.map((d) => ({
        sleepHours: d.totalSleepTime.hours + d.totalSleepTime.minutes / 60,
        deepSleepHours:
          (parsePct(d.analysis.deepSleep) / 100) *
          (d.totalSleepTime.hours + d.totalSleepTime.minutes / 60),
        sleepLatency: parseNum(d.analysis.sleepLatency),
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
      })),
    };
  }, [fitbitMonthData]);

  const formatMonthOnly = (date: Date) => `${date.getMonth() + 1}월`;

  const canGoNextMonth = useMemo(() => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return (
      nextMonth.getFullYear() < today.getFullYear() ||
      (nextMonth.getFullYear() === today.getFullYear() &&
        nextMonth.getMonth() <= today.getMonth())
    );
  }, [currentMonth, today]);

  // ✅ 전월 평균 품질 계산
  const prevMonthAvgQuality = useMemo(() => {
    if (!fitbitPrevMonthData || fitbitPrevMonthData.length === 0) return null;
    const total = fitbitPrevMonthData.reduce((sum, d) => sum + d.quality, 0);
    return Math.round(total / fitbitPrevMonthData.length);
  }, [fitbitPrevMonthData]);

  // ✅ 전월 대비 변화율 계산
  const monthComparison = useMemo(() => {
    if (!averageData || prevMonthAvgQuality === null) return 0;
    return averageData.quality - prevMonthAvgQuality;
  }, [averageData, prevMonthAvgQuality]);

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

  // =====================
  // Sleep Feedback Message (구간별 피드백)
  // =====================

  const getSleepFeedbackMessage = (changeRate: number): string => {
    if (changeRate >= 1) {
      // 상승 (+1% 이상)
      return "이번 달도 좋은 수면을 이어가고 있습니다. 지금처럼 규칙적인 수면 습관을 유지하시면 건강 관리에 도움이 됩니다.";
    } else if (changeRate === 0) {
      // 유지 (0%)
      return "지난달과 비슷한 수준의 수면을 유지하고 있습니다. 지금처럼 일정한 수면 리듬을 이어가는 것이 좋습니다.";
    } else if (changeRate >= -5) {
      // 소폭 하락 (-1% ~ -5%)
      return "좋은 수면을 유지하고 있지만, 지난달보다 조금 아쉽습니다. 평소의 수면 습관을 잘 이어가시면 다시 좋아지는 데 도움이 됩니다.";
    } else if (changeRate >= -10) {
      // 주의 필요 (-6% ~ -10%)
      return "수면 품질이 지난달보다 다소 떨어졌습니다. 최근 생활 리듬이나 피로, 스트레스의 영향이 있었을 수 있으니 수면 습관을 한 번 살펴보세요.";
    } else {
      // 급격한 하락 (-11% 이하)
      return "수면의 질이 크게 저하되었습니다. 최근 수면 상태를 다시 살펴보고, 필요하면 전문가와 상담을 고려해보세요.";
    }
  };

  // =====================
  // Mission Message
  // =====================

  const getMissionMessage = (measuredDays: number) => {
    if (measuredDays === 0) {
      return {
        title: "첫 수면 측정 완료 미션",
        desc: "오늘 밤 수면을 측정하고 첫 리워드를 받아보세요.",
      };
    } else if (measuredDays < 3) {
      return {
        title: "연속 수면 기록 미션 (3회, 5회, 10회)",
        desc: "꾸준히 수면을 기록하면 수면 문제에 대한 개선점이 보여요!",
      };
    } else if (measuredDays < 10) {
      return {
        title: "규칙적인 취침 시간 미션",
        desc: "비슷한 시간에 잠들수록 더 좋은 수면 습관에 가까워집니다.",
      };
    } else if (measuredDays < 20) {
      return {
        title: "수면 자가진단 참여 미션",
        desc: "간단한 자가진단을 완료하고 내 수면 상태를 체크해보세요.",
      };
    } else {
      return {
        title: "월간 수면 유지/상승 미션",
        desc: "지난달보다 수면 리듬을 잘 유지하셨네요. 이번 달 리워드를 확인해보세요.",
      };
    }
  };

  // =====================
  // Chart Helpers
  // =====================

  const commonChart = {
    w: screenWidth - 18 * 2 - 16 * 2,
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
    yLabelsRight: string[],
  ) => {
    const { w, h, padX, padY, rightAxis, gridLines } = commonChart;
    const chartW = w - padX * 2 - rightAxis;
    const chartH = h - padY * 2 - 18;
    const safe = values.length ? values : [0];
    const barGap = 3;
    const barW = Math.max(2, chartW / safe.length - barGap);
    const yOf = (v: number) => padY + chartH - (v / maxValue) * chartH;

    return (
      <ChartBox>
        <Svg width={w} height={h}>
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
          {safe.map((v, i) => {
            const x = padX + i * (barW + barGap);
            const y = yOf(v);
            const bh = padY + chartH - y;
            const normalizedValue = v / maxValue;
            const opacity =
              v < 0.5
                ? Math.max(0.05, v * 0.2)
                : Math.max(0.4, Math.min(1, 0.6 + normalizedValue * 0.4));
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
    yLabelsRight: string[],
  ) => {
    const { w, h, padX, padY, rightAxis, gridLines } = commonChart;
    const chartW = w - padX * 2 - rightAxis;
    const chartH = h - padY * 2 - 18;
    const safe = values.length ? values : [0];
    const stepX = safe.length > 1 ? chartW / (safe.length - 1) : 0;
    const yOf = (v: number) => {
      const denom = maxV - minV || 1;
      return padY + chartH - ((v - minV) / denom) * chartH;
    };
    let d = "";
    safe.forEach((v, i) => {
      const x = padX + i * stepX;
      const y = yOf(v);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    const bottomY = padY + chartH;
    const areaPath = `${d} L ${padX + (safe.length - 1) * stepX} ${bottomY} L ${padX} ${bottomY} Z`;

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
          <Path d={areaPath} fill="url(#areaGradient)" />
          <Path
            d={d}
            fill="none"
            stroke="#9D7AFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);

    return (
      <View style={{ width: "100%", alignItems: "center", marginVertical: 32 }}>
        <Svg width={chartWidth} height={chartHeight}>
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
            {formatMonthOnly(prevMonth)}
          </SvgText>
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
            {formatMonthOnly(currentMonth)}
          </SvgText>
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

  // 로딩 중이거나 데이터 없을 때
  if (fitbitLoading || fitbitPrevLoading) {
    return (
      <Screen>
        <Content>
          <MonthTitle>데이터 불러오는 중...</MonthTitle>
        </Content>
      </Screen>
    );
  }

  if (!averageData) {
    return (
      <Screen>
        <Content>
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
          <SummarySection>
            <SummaryText>이 달의 수면 데이터가 없습니다.</SummaryText>
          </SummarySection>
        </Content>
      </Screen>
    );
  }

  const measurementProgress = averageData.measuredDays;
  const measurementGoal = 30;
  const measurementProgressPercent = Math.min(
    100,
    (measurementProgress / measurementGoal) * 100,
  );
  const goalAchievements = averageData.dailyData.filter(
    (d) => d.sleepHours >= 8,
  ).length;
  const goalProgressPercent = averageData.measuredDays
    ? (goalAchievements / averageData.measuredDays) * 100
    : 0;
  const morningMoodCount = goalAchievements;
  const morningMoodProgressPercent = goalProgressPercent;

  // ✅ 실제 데이터 기반 차트 데이터 생성
  const sleepHoursChartData = averageData.dailyData.map((d) => d.sleepHours);
  const deepSleepChartData = averageData.dailyData.map((d) => d.deepSleepHours);
  const sleepLatencyChartData = averageData.dailyData.map(
    (d) => d.sleepLatency,
  );
  const wakeMinChartData = averageData.dailyData.map((d) => d.wakeMin);
  const bedMinChartData = averageData.dailyData.map((d) => d.bedMin);

  const wakeMinValues = wakeMinChartData.filter((v) => v > 0);
  const wakeMinMin =
    wakeMinValues.length > 0
      ? Math.max(300, Math.min(...wakeMinValues) - 30)
      : 360;
  const wakeMinMax =
    wakeMinValues.length > 0
      ? Math.min(780, Math.max(...wakeMinValues) + 30)
      : 720;

  const bedMinValues = bedMinChartData.filter((v) => v > 0);
  const bedMinMin =
    bedMinValues.length > 0
      ? Math.max(1200, Math.min(...bedMinValues) - 30)
      : 1320;
  const bedMinMax =
    bedMinValues.length > 0
      ? Math.min(1500, Math.max(...bedMinValues) + 30)
      : 1440;

  const missionMessage = getMissionMessage(averageData.measuredDays);

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

          {/* 상단 요약 */}
          <SummarySection>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <SummaryColorText>
                총 {averageData.measuredDays}일
              </SummaryColorText>
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
              <SummaryColorText>
                하루 평균 {averageData.avgSleepTime.hours}시간{" "}
                {averageData.avgSleepTime.minutes}분
              </SummaryColorText>
              <SummaryText style={{ marginLeft: 4 }}>수면</SummaryText>
            </View>
            <SummarySub style={{ marginTop: 16 }}>
              {getSleepFeedbackMessage(monthComparison)}
            </SummarySub>
          </SummarySection>

          {/* 첫 카드 */}
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
                    <QualityBadgeText>
                      {averageData.quality >= 80
                        ? "Good"
                        : averageData.quality >= 60
                          ? "Fair"
                          : "Poor"}
                    </QualityBadgeText>
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

            <ProgressCard>
              <ProgressHeader>
                <ProgressTitle>
                  <SummaryColorText>
                    총 {measurementProgress}회 수면 측정
                  </SummaryColorText>
                  <ShieldSvg width={21} height={21} />
                </ProgressTitle>
              </ProgressHeader>
              <ProgressSub>
                {/* ✅ HelpSvg 클릭 시 미션 모달 오픈 */}
                <TouchableOpacity
                  onPress={() => setMissionModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <HelpSvg width={20} height={20} />
                </TouchableOpacity>
                <ProgressSubText>
                  측정 미션 성공까지{" "}
                  {Math.max(0, measurementGoal - measurementProgress)}회 남음
                </ProgressSubText>
              </ProgressSub>
              <ProgressBar2Container>
                <ProgressBar width={measurementProgressPercent} />
              </ProgressBar2Container>
            </ProgressCard>
          </Card>

          {/* ✅ 실제 데이터 기반 차트들 */}

          {/* 수면 시간 차트 */}
          <Card>
            <ChartCardTitle>
              하루 평균 수면시간은{" "}
              <ChartTitleStrong>
                {averageData.avgSleepTime.hours}시간{" "}
                {averageData.avgSleepTime.minutes}분
              </ChartTitleStrong>
              입니다.
            </ChartCardTitle>
            {renderBarChart(sleepHoursChartData, 10, [
              "8h",
              "6h",
              "4h",
              "2h",
              "0h",
            ])}
          </Card>

          {/* 기상 시간 차트 */}
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
            {renderLineChart(wakeMinChartData, wakeMinMin, wakeMinMax, [
              "12pm",
              "11am",
              "10am",
              "9am",
              "8am",
              "7am",
              "6am",
            ])}
          </Card>

          {/* 취침 시간 차트 */}
          <Card>
            <ChartCardTitle>
              평균 취침 시간은{" "}
              <ChartTitleStrong>
                {(() => {
                  const totalMin = averageData.bedtimeMinAvg;
                  const rawHour = Math.floor(totalMin / 60) % 24;
                  const min = totalMin % 60;
                  const displayHour =
                    rawHour === 0 ? 12 : rawHour > 12 ? rawHour - 12 : rawHour;
                  const ampm = rawHour >= 12 ? "오후" : "오전";
                  return `${ampm} ${displayHour}시 ${min}분`;
                })()}
              </ChartTitleStrong>{" "}
              입니다.
            </ChartCardTitle>
            {renderLineChart(bedMinChartData, bedMinMin, bedMinMax, [
              "1am",
              "12am",
              "11pm",
              "10pm",
              "9pm",
            ])}
          </Card>

          {/* 잠드는 시간 차트 */}
          <Card>
            <ChartCardTitle>
              평균 잠드는 데 걸리는 시간은{" "}
              <ChartTitleStrong>{averageData.sleepLatency}분</ChartTitleStrong>{" "}
              입니다.
            </ChartCardTitle>
            {renderBarChart(
              sleepLatencyChartData,
              Math.max(60, Math.max(...sleepLatencyChartData) + 10),
              ["60m", "45m", "30m", "15m", "0m"],
            )}
          </Card>

          {/* 깊은 수면 차트 */}
          <Card>
            <ChartCardTitle>
              평균 깊은 잠을 자는 시간은{" "}
              <ChartTitleStrong>
                {averageData.deepSleepTime.hours}시간{" "}
                {averageData.deepSleepTime.minutes}분
              </ChartTitleStrong>
              입니다.
            </ChartCardTitle>
            {renderBarChart(deepSleepChartData, 4, ["3h", "2h", "1h", "0h"])}
          </Card>

          {/* 수면 목표 달성 */}
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

          {/* 맑은 기분 */}
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

      {/* ✅ 미션 설명 모달 */}
      <Modal
        visible={missionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMissionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMissionModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#1E2D45",
                  borderRadius: 16,
                  padding: 24,
                  width: "100%",
                }}
              >
                {/* 모달 헤더 */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <HelpSvg width={22} height={22} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: theme.colors.text,
                    }}
                  >
                    미션
                  </Text>
                </View>

                {/* 미션 제목 */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: theme.colors.secondary,
                    marginBottom: 8,
                  }}
                >
                  {missionMessage.title}
                </Text>

                {/* 미션 설명 */}
                <Text
                  style={{
                    fontSize: 15,
                    color: theme.colors.textSecondary,
                    lineHeight: 22,
                    marginBottom: 20,
                  }}
                >
                  {missionMessage.desc}
                </Text>

                {/* 확인 버튼 */}
                <TouchableOpacity
                  onPress={() => setMissionModalVisible(false)}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.text,
                    }}
                  >
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Screen>
  );
};

export default StatsScreen;
