import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Animated, View, TextInput } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Svg from "react-native-svg";
import { Circle, Path, Polygon, Text as SvgText, Line } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SleepQualityInfoModal from "./components/SleepQualityInfoModal";
import SleepMemoModal, { sleepMemoOptions } from "./components/SleepMemoModal";
import SleepDiaryModal from "./components/SleepDiaryModal";
import SvgIcon from "../../shared/components/common/SvgIcon";
import Button from "../../shared/components/common/Button";

// =====================
// Styled Components
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
`;

const Header = styled.View`
  background-color: rgba(79, 107, 145, 0.24);
  padding: 16px;
  padding-bottom: 8px;
  padding-top: 40px;
  border-bottom-right-radius: ${({ theme }) => theme.radius.md}px;
  border-bottom-left-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 16px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const DayHeader = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const DateHeader = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TimeBadge = styled.View`
  background-color: rgba(37, 195, 251, 0.12);
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 4px 8px;
`;

const TimeBadgeText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
`;

const WeekDaysContainer = styled.View`
  flex-direction: row;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const WeekDay = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  width: ${100 / 7}%;
  text-align: center;
`;

const CalendarContainer = styled.View`
  overflow: hidden;
`;

const CalendarContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DateItemContainer = styled.View`
  width: ${100 / 7}%;
  align-items: center;
  justify-content: center;
`;

const DateItem = styled.TouchableOpacity<{
  selected: boolean;
  hasData?: boolean;
}>`
  width: 40px;
  height: 40px;
  margin-bottom: 11px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  align-items: center;
  justify-content: center;
  border-width: ${({ selected, hasData }) =>
    selected ? 2 : hasData ? 1 : 0}px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.primary + "80"};
  background-color: ${({ selected }) =>
    selected ? "rgba(255, 255, 255, 0.08)" : "transparent"};
`;

const DateText = styled.Text<{ selected: boolean; hasData?: boolean }>`
  font-size: 18px;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.text : theme.colors.textSecondary};
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
`;

const ToggleButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const TabContentContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: 16px;
  margin-top: 12px;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 24px;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 16px 0;
  margin-right: 16px;
  border-bottom-width: ${({ active }) => (active ? 2 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.text};
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 16px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active, theme }) =>
    active ? theme.colors.text : theme.colors.gray400};
`;

const Card = styled.View<{ hasDivider?: boolean }>`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
  margin-bottom: ${({ hasDivider }) => (hasDivider ? 0 : 0)}px;
  position: relative;
`;

const InfoIconContainer = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const SleepSummaryContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const SleepSummaryLeft = styled.View`
  width: 155px;
`;

const SleepSummaryRight = styled.View`
  gap: 24px;
`;

const SleepSummaryItem = styled.View``;

const SleepSummaryLabel = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.gray200};
  margin-bottom: 8px;
`;

const SleepSummaryValue = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const QualityCircleContainer = styled.View`
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const QualityCircleContent = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const QualityText = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const QualityLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 4px;
`;

const SleepStageGraph = styled.View`
  height: 120px;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
`;

const GraphContainer = styled.View`
  width: 100%;
  height: 100%;
  padding: 12px;
`;

const GraphLegend = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LegendColor = styled.View<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ color }) => color};
  margin-right: 6px;
`;

const LegendText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SnoringItem = styled.View`
  margin-bottom: 16px;
`;

const SnoringTime = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const SnoringWaveform = styled.View`
  height: 40px;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 8px;
`;

const SnoringControls = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PlayButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.gray700};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

// 수면 메모 관련 스타일
const SleepMemoSection = styled.View`
  margin-bottom: 24px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const AddButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.gray700};
  align-items: center;
  justify-content: center;
`;

const MemoPillsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const MemoPill = styled.View`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const MemoPillText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

// 수면 일기 관련 스타일
const SleepDiarySection = styled.View`
  margin-bottom: 24px;
`;

const DiaryHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const EditButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

const DiaryInput = styled.TextInput`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  min-height: 120px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-align-vertical: top;
`;

// ✅ 가로 구분선 (위/아래 20px)
const SectionDivider = styled.View`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.08);
  margin-vertical: 20px;
`;

// ✅ 이미지처럼 “4개씩” 끊어서 보여줄 테이블 블록
const AnalysisTable = styled.View`
  background-color: rgba(79, 107, 145, 0.12);
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;

  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
`;

const AnalysisCell = styled.View<{
  showRightBorder: boolean;
  showBottomBorder: boolean;
}>`
  width: 50%;
  padding: 16px;

  border-right-width: ${({ showRightBorder }) => (showRightBorder ? 1 : 0)}px;
  border-right-color: rgba(255, 255, 255, 0.08);

  border-bottom-width: ${({ showBottomBorder }) =>
    showBottomBorder ? 1 : 0}px;
  border-bottom-color: rgba(255, 255, 255, 0.08);
`;

const AnalysisCellLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const AnalysisCellValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

// 코칭 관련 스타일
const CoachingContainer = styled.View`
  margin-bottom: 40px;
`;

const CoachingContent = styled.View`
  padding: 20px;
  background-color: rgba(79, 107, 145, 0.24);
  position: relative;
`;

const QuoteIconLeft = styled.View`
  position: absolute;
  top: 55px;
  left: 15px;
`;

const QuoteIconRight = styled.View`
  position: absolute;
  bottom: 20px;
  right: 15px;
`;

const CoachingTitleContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CoachingTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CoachingAdviceContainer = styled.View`
  position: relative;
  padding-right: 24px;
`;

const CoachingAdvice = styled.Text`
  font-size: 18px;
  line-height: 28.8px;
  color: ${({ theme }) => theme.colors.text};
`;

// 수면 목표 관련 스타일
const GoalContainer = styled.View`
  margin-bottom: 40px;
`;

const GoalMessageContainer = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  text-align: center;
  line-height: 32px;
`;

const GoalTitleText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
`;

// =====================
// Types
// =====================

type TabKey = "analysis" | "diary" | "coaching" | "goal";

interface SleepData {
  quality: number; // 0-100
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
  snoringSegments: Array<{
    time: string;
    isPlaying?: boolean;
  }>;
  coaching: string;
  memoOptions: string[];
  diary: string;
}

type SleepDataMap = Record<string, SleepData>;

const STORAGE_KEY = "@diary_sleep_data";

// =====================
// Component
// =====================

const DiaryScreen = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("analysis");
  const [isQualityModalVisible, setIsQualityModalVisible] = useState(false);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
  const [isDiaryModalVisible, setIsDiaryModalVisible] = useState(false);
  const [sleepDataMap, setSleepDataMap] = useState<SleepDataMap>({});
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 현재 선택된 날짜의 데이터 가져오기
  const getDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getCurrentSleepData = useCallback((): SleepData => {
    const dateKey = getDateKey(selectedDate);
    const existingData = sleepDataMap[dateKey];

    if (existingData) {
      return existingData;
    }

    // 기본 데이터 생성 (랜덤하게 약간씩 변동)
    const dayOfMonth = selectedDate.getDate();
    const baseQuality = 65 + (dayOfMonth % 20); // 65-84 범위
    const baseHours = 6 + Math.floor(dayOfMonth % 3);
    const baseMinutes = 30 + (dayOfMonth % 30);

    return {
      quality: Math.min(100, baseQuality),
      totalSleepTime: {
        hours: baseHours,
        minutes: baseMinutes,
      },
      timeInBed: {
        hours: baseHours + 1,
        minutes: (baseMinutes + 20) % 60,
      },
      sleepGoal: {
        hours: 7,
        minutes: 30,
      },
      bedtime: {
        hour: 11 + (dayOfMonth % 2),
        minute: 10 + (dayOfMonth % 20),
        ampm: "PM" as const,
      },
      wakeTime: {
        hour: 7 + (dayOfMonth % 2),
        minute: dayOfMonth % 30,
        ampm: "AM" as const,
      },
      analysis: {
        regularity: `${85 + (dayOfMonth % 10)}%`,
        heartRate: `${60 + (dayOfMonth % 10)}`,
        temperatureChange: `${1 + (dayOfMonth % 2)}°C`,
        temperatureStability: `36°C / ${45 + (dayOfMonth % 10)}%`,
        sleepLatency: `${15 + (dayOfMonth % 15)}분`,
        deepSleep: `${20 + (dayOfMonth % 10)}%`,
        lightSleep: `${45 + (dayOfMonth % 10)}%`,
        remSleep: `${20 + (dayOfMonth % 10)}%`,
        awakeTime: `${15 + (dayOfMonth % 10)}%`,
        snoring: `${2 + (dayOfMonth % 2)}시간 ${15 + (dayOfMonth % 45)}분`,
      },
      snoringSegments: [
        { time: "02:14 AM", isPlaying: false },
        { time: "03:45 AM", isPlaying: false },
      ],
      coaching:
        "깊은 잠이 줄어들었습니다.\n저녁에는 휴대폰 사용을 줄이고, 따뜻한 차로 마음을 안정시켜보세요.",
      memoOptions: [],
      diary: "",
    };
  }, [selectedDate, sleepDataMap]);

  const currentSleepData = getCurrentSleepData();

  // 데이터 저장
  const saveSleepData = useCallback(
    async (date: Date, data: Partial<SleepData>) => {
      const dateKey = getDateKey(date);
      const updatedData = {
        ...currentSleepData,
        ...data,
      };

      const newDataMap = {
        ...sleepDataMap,
        [dateKey]: updatedData,
      };

      setSleepDataMap(newDataMap);

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDataMap));
      } catch (error) {
        console.error("데이터 저장 실패:", error);
      }
    },
    [currentSleepData, sleepDataMap]
  );

  // 데이터 로드
  useEffect(() => {
    const loadSleepData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSleepDataMap(JSON.parse(stored));
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    loadSleepData();
  }, []);

  // 수면 품질 계산
  const sleepQuality = currentSleepData.quality;
  const circleRadius = 50;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const qualityProgress = circleCircumference * (sleepQuality / 100);
  const qualityOffset = circleCircumference - qualityProgress;

  const formatDate = (date: Date) => {
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];

    const weekday = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${weekday} ${month} ${day}일`;
  };

  const calculateTimeDifference = () => {
    const { totalSleepTime, sleepGoal } = currentSleepData;
    const totalMinutes = totalSleepTime.hours * 60 + totalSleepTime.minutes;
    const goalMinutes = sleepGoal.hours * 60 + sleepGoal.minutes;
    const diffMinutes = totalMinutes - goalMinutes;

    if (diffMinutes === 0) {
      return "목표 달성";
    }

    const absDiff = Math.abs(diffMinutes);
    const hours = Math.floor(absDiff / 60);
    const minutes = absDiff % 60;

    const sign = diffMinutes > 0 ? "+" : "-";
    if (hours > 0 && minutes > 0) {
      return `${sign}${hours}시간 ${minutes}분`;
    } else if (hours > 0) {
      return `${sign}${hours}시간`;
    } else {
      return `${sign}${minutes}분`;
    }
  };

  const getWeekDates = (date: Date) => {
    const currentDay = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - currentDay);

    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate);
    }
    return weekDates;
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const dates: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) dates.push(null);
    for (let i = 1; i <= daysInMonth; i++) dates.push(new Date(year, month, i));
    return dates;
  };

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const monthDates = useMemo(() => getMonthDates(selectedDate), [selectedDate]);

  const hasData = (date: Date) => {
    const dateKey = getDateKey(date);
    return !!sleepDataMap[dateKey];
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const toggleCalendar = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const calendarHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 280],
  });

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 분석 데이터를 현재 선택된 날짜의 데이터로 구성
  const analysisGroups = useMemo(() => {
    const { analysis, bedtime, wakeTime } = currentSleepData;
    const bedtimeStr = `${bedtime.ampm === "AM" ? "오전" : "오후"} ${
      bedtime.hour
    }:${bedtime.minute.toString().padStart(2, "0")}`;
    const wakeTimeStr = `${wakeTime.ampm === "AM" ? "오전" : "오후"} ${
      wakeTime.hour
    }:${wakeTime.minute.toString().padStart(2, "0")}`;

    return [
      [
        { label: "수면 규칙성", value: analysis.regularity },
        { label: "심박수", value: analysis.heartRate },
        { label: "체온 변화", value: analysis.temperatureChange },
        { label: "체온 안정성", value: analysis.temperatureStability },
      ],
      [
        { label: "잠들기까지", value: analysis.sleepLatency },
        { label: "취침 시간", value: bedtimeStr },
        { label: "기상 시간", value: wakeTimeStr },
        { label: "코골기", value: analysis.snoring },
      ],
      [
        { label: "깊은 수면", value: analysis.deepSleep },
        { label: "얕은 수면", value: analysis.lightSleep },
        { label: "기상 시간", value: analysis.awakeTime },
        { label: "렘수면", value: analysis.remSleep },
      ],
    ];
  }, [currentSleepData]);

  const renderAnalysisBlock = (
    items: { label: string; value: string }[],
    isLast?: boolean
  ) => {
    return (
      <View style={{ marginBottom: isLast ? 0 : 16 }}>
        <AnalysisTable>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {items.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              const isTopRow = idx < 2;

              return (
                <AnalysisCell
                  key={`${item.label}-${idx}`}
                  showRightBorder={isLeft}
                  showBottomBorder={isTopRow}
                >
                  <AnalysisCellLabel>{item.label}</AnalysisCellLabel>
                  <AnalysisCellValue>{item.value}</AnalysisCellValue>
                </AnalysisCell>
              );
            })}
          </View>
        </AnalysisTable>
      </View>
    );
  };

  // 수면 단계 그래프 데이터 생성
  const generateSleepStageData = useCallback(() => {
    const dayOfMonth = selectedDate.getDate();
    const hours = 7; // 7시간 수면
    const points = 50; // 50개 포인트 (더 부드럽게)

    // 수면 단계 값: 0 = 깨어있음, 1 = 얕은 수면, 2 = 깊은 수면
    const lightSleep: number[] = [];
    const deepSleep: number[] = [];

    // 자연스러운 수면 패턴 생성
    for (let i = 0; i < points; i++) {
      const progress = i / points;
      const variation = Math.sin(i * 0.3 + dayOfMonth * 0.1) * 0.15;

      if (i < 5) {
        // 처음: 깨어있음
        lightSleep.push(0);
        deepSleep.push(0);
      } else if (i < 15) {
        // 얕은 수면으로 전환
        const lightProgress = (i - 5) / 10;
        lightSleep.push(0.3 + lightProgress * 0.4 + variation);
        deepSleep.push(0);
      } else if (i < 30) {
        // 깊은 수면 (점진적 증가 후 감소)
        const deepProgress = (i - 15) / 15;
        const deepValue = Math.sin(deepProgress * Math.PI) * 0.6;
        deepSleep.push(deepValue + variation * 0.5);
        lightSleep.push(0.2 + variation);
      } else if (i < 40) {
        // 얕은 수면으로 복귀
        const lightProgress = (i - 30) / 10;
        lightSleep.push(0.3 + lightProgress * 0.3 + variation);
        deepSleep.push(0.1 - lightProgress * 0.1);
      } else {
        // 얕은 수면
        lightSleep.push(0.5 + variation);
        deepSleep.push(0);
      }
    }

    return { lightSleep, deepSleep, hours, points };
  }, [selectedDate]);

  const sleepStageData = generateSleepStageData();

  // 수면 단계 그래프 렌더링
  const renderSleepStageGraph = () => {
    const graphWidth = 300;
    const graphHeight = 96;
    const padding = 12;
    const chartWidth = graphWidth - padding * 2;
    const chartHeight = graphHeight - padding * 2;

    const { lightSleep, deepSleep, points } = sleepStageData;
    const pointSpacing = chartWidth / (points - 1);

    // Y축 위치 계산 (0=아래, 1=위)
    const getY = (value: number) => {
      const normalized = Math.max(0, Math.min(1, value));
      return padding + chartHeight - normalized * chartHeight;
    };

    // 부드러운 라인 경로 생성
    const createLinePath = (values: number[]) => {
      if (values.length === 0) return "";

      let path = "";

      for (let i = 0; i < values.length; i++) {
        const x = padding + i * pointSpacing;
        const y = getY(values[i]);

        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          const prevX = padding + (i - 1) * pointSpacing;
          const prevY = getY(values[i - 1]);
          const nextX =
            i < values.length - 1 ? padding + (i + 1) * pointSpacing : x;
          const nextY = i < values.length - 1 ? getY(values[i + 1]) : y;

          // 제어점 계산 (부드러운 곡선)
          const cp1x = prevX + (x - prevX) * 0.5;
          const cp1y = prevY;
          const cp2x = x - (nextX - x) * 0.5;
          const cp2y = y;

          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }
      }

      return path;
    };

    // 부드러운 영역 경로 생성
    const createAreaPath = (values: number[]) => {
      if (values.length === 0) return "";

      let path = `M ${padding} ${padding + chartHeight}`;

      // 위쪽 경로 (부드러운 곡선)
      for (let i = 0; i < values.length; i++) {
        const x = padding + i * pointSpacing;
        const y = getY(values[i]);

        if (i === 0) {
          path += ` L ${x} ${y}`;
        } else {
          const prevX = padding + (i - 1) * pointSpacing;
          const prevY = getY(values[i - 1]);
          const nextX =
            i < values.length - 1 ? padding + (i + 1) * pointSpacing : x;
          const nextY = i < values.length - 1 ? getY(values[i + 1]) : y;

          // 제어점 계산 (부드러운 곡선)
          const cp1x = prevX + (x - prevX) * 0.5;
          const cp1y = prevY;
          const cp2x = x - (nextX - x) * 0.5;
          const cp2y = y;

          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }
      }

      // 아래쪽으로 닫기
      const lastX = padding + (values.length - 1) * pointSpacing;
      path += ` L ${lastX} ${padding + chartHeight} Z`;

      return path;
    };

    // 얕은 수면 + 깊은 수면 결합
    const combinedSleep = lightSleep.map((light, i) =>
      Math.min(1, light + deepSleep[i])
    );

    return (
      <GraphContainer>
        <Svg width={graphWidth} height={graphHeight}>
          {/* 배경 그리드 */}
          {[0, 1, 2].map((level) => (
            <Line
              key={`grid-${level}`}
              x1={padding}
              y1={padding + (chartHeight / 2) * (2 - level)}
              x2={padding + chartWidth}
              y2={padding + (chartHeight / 2) * (2 - level)}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          ))}

          {/* 전체 수면 영역 (얕은 수면 + 깊은 수면) */}
          <Path
            d={createAreaPath(combinedSleep)}
            fill="#7353FF"
            fillOpacity="0.3"
          />

          {/* 깊은 수면 영역 */}
          <Path
            d={createAreaPath(deepSleep)}
            fill="#25C3FB"
            fillOpacity="0.5"
          />

          {/* 얕은 수면 라인 */}
          <Path
            d={createLinePath(lightSleep)}
            fill="none"
            stroke="#7353FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 깊은 수면 라인 */}
          <Path
            d={createLinePath(deepSleep)}
            fill="none"
            stroke="#25C3FB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X축 시간 라벨 */}
          <SvgText
            x={padding}
            y={graphHeight - 2}
            fontSize="10"
            fill={theme.colors.textSecondary}
          >
            2am
          </SvgText>
          <SvgText
            x={padding + chartWidth}
            y={graphHeight - 2}
            fontSize="10"
            fill={theme.colors.textSecondary}
            textAnchor="end"
          >
            7 (시간)
          </SvgText>
        </Svg>
      </GraphContainer>
    );
  };

  return (
    <Screen>
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          <Header>
            <HeaderContainer>
              <DateContainer>
                <DayHeader>{formatDate(selectedDate).split(" ")[0]}</DayHeader>
                <DateHeader>
                  {formatDate(selectedDate).split(" ")[1]}{" "}
                  {formatDate(selectedDate).split(" ")[2]}
                </DateHeader>
              </DateContainer>
              <TimeBadge>
                <TimeBadgeText>{calculateTimeDifference()}</TimeBadgeText>
              </TimeBadge>
            </HeaderContainer>

            <WeekDaysContainer>
              {weekDays.map((day, index) => (
                <WeekDay key={index}>{day}</WeekDay>
              ))}
            </WeekDaysContainer>

            <CalendarContainer>
              <Animated.View
                style={{ height: calendarHeight, overflow: "hidden" }}
              >
                <CalendarContent>
                  {isExpanded
                    ? monthDates.map((date, index) => {
                        if (date === null) {
                          return (
                            <DateItemContainer key={index}>
                              <DateItem
                                selected={false}
                                hasData={false}
                                disabled
                                style={{ opacity: 0 }}
                              >
                                <DateText selected={false} hasData={false}>
                                  {" "}
                                </DateText>
                              </DateItem>
                            </DateItemContainer>
                          );
                        }

                        const isSelected =
                          date.toDateString() === selectedDate.toDateString();
                        const dateHasData = hasData(date);

                        return (
                          <DateItemContainer key={index}>
                            <DateItem
                              selected={isSelected}
                              hasData={dateHasData}
                              onPress={() => handleDateSelect(date)}
                              activeOpacity={0.7}
                            >
                              <DateText
                                selected={isSelected}
                                hasData={dateHasData}
                              >
                                {date.getDate()}
                              </DateText>
                            </DateItem>
                          </DateItemContainer>
                        );
                      })
                    : weekDates.map((date, index) => {
                        const isSelected =
                          date.toDateString() === selectedDate.toDateString();
                        const dateHasData = hasData(date);

                        return (
                          <DateItemContainer key={index}>
                            <DateItem
                              selected={isSelected}
                              hasData={dateHasData}
                              onPress={() => handleDateSelect(date)}
                              activeOpacity={0.7}
                            >
                              <DateText
                                selected={isSelected}
                                hasData={dateHasData}
                              >
                                {date.getDate()}
                              </DateText>
                            </DateItem>
                          </DateItemContainer>
                        );
                      })}
                </CalendarContent>
              </Animated.View>
            </CalendarContainer>

            <ToggleButton onPress={toggleCalendar} activeOpacity={0.7}>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color={theme.colors.gray300}
              />
            </ToggleButton>
          </Header>

          {/* 수면 요약 카드 */}
          <Card>
            <InfoIconContainer
              onPress={() => setIsQualityModalVisible(true)}
              activeOpacity={0.7}
            >
              <SvgIcon
                Component={
                  require("../../../assets/icon/information-circle.svg")
                    .default ||
                  require("../../../assets/icon/information-circle.svg")
                }
                width={32}
                height={32}
                fill={theme.colors.secondary}
              />
            </InfoIconContainer>

            <SleepSummaryContainer>
              <SleepSummaryLeft>
                <QualityCircleContainer>
                  <Svg
                    width="120"
                    height="120"
                    style={{ position: "absolute" }}
                  >
                    <Circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      stroke={`${theme.colors.primary}33`}
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <Circle
                      cx="60"
                      cy="60"
                      r={circleRadius}
                      stroke={theme.colors.primary}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={qualityOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </Svg>

                  <QualityCircleContent>
                    <QualityText>{sleepQuality}%</QualityText>
                    <QualityLabel>품질</QualityLabel>
                  </QualityCircleContent>
                </QualityCircleContainer>
              </SleepSummaryLeft>

              <SleepSummaryRight>
                <SleepSummaryItem>
                  <SleepSummaryLabel>총 수면 시간</SleepSummaryLabel>
                  <SleepSummaryValue>
                    {currentSleepData.totalSleepTime.hours}시간{" "}
                    {currentSleepData.totalSleepTime.minutes}분
                  </SleepSummaryValue>
                </SleepSummaryItem>
                <SleepSummaryItem>
                  <SleepSummaryLabel>침대에 머문 시간</SleepSummaryLabel>
                  <SleepSummaryValue>
                    {currentSleepData.timeInBed.hours}시간{" "}
                    {currentSleepData.timeInBed.minutes}분
                  </SleepSummaryValue>
                </SleepSummaryItem>
              </SleepSummaryRight>
            </SleepSummaryContainer>
          </Card>

          {/* 탭 컨테이너 */}
          <TabContentContainer>
            <TabsContainer>
              <Tab
                active={activeTab === "analysis"}
                onPress={() => setActiveTab("analysis")}
                activeOpacity={1}
              >
                <TabText active={activeTab === "analysis"}>분석</TabText>
              </Tab>
              <Tab
                active={activeTab === "diary"}
                onPress={() => setActiveTab("diary")}
                activeOpacity={1}
              >
                <TabText active={activeTab === "diary"}>일지</TabText>
              </Tab>
              <Tab
                active={activeTab === "coaching"}
                onPress={() => setActiveTab("coaching")}
                activeOpacity={1}
              >
                <TabText active={activeTab === "coaching"}>코칭</TabText>
              </Tab>
              <Tab
                active={activeTab === "goal"}
                onPress={() => setActiveTab("goal")}
                activeOpacity={1}
              >
                <TabText active={activeTab === "goal"}>수면 목표</TabText>
              </Tab>
            </TabsContainer>

            {activeTab === "analysis" && (
              <>
                {/* 수면 단계 카드 */}
                <Card>
                  <CardHeader>
                    {React.createElement(
                      require("../../../assets/icon/activity.svg").default ||
                        require("../../../assets/icon/activity.svg"),
                      { width: 24, height: 24 }
                    )}
                    <CardTitle>수면 단계</CardTitle>
                  </CardHeader>

                  <SleepStageGraph>{renderSleepStageGraph()}</SleepStageGraph>

                  <GraphLegend>
                    <LegendItem style={{ marginRight: 16 }}>
                      <LegendColor color="#7353FF" />
                      <LegendText>자다 깸 수면</LegendText>
                    </LegendItem>
                    <LegendItem>
                      <LegendColor color="#25C3FB" />
                      <LegendText>깊은 수면</LegendText>
                    </LegendItem>
                  </GraphLegend>
                </Card>

                {/* ✅ 수면 단계 밑 가로선 (위/아래 20px) */}
                <SectionDivider />

                {/* 수면 분석 카드 (4개씩 3블록) */}
                <Card>
                  <CardHeader>
                    {React.createElement(
                      require("../../../assets/icon/search.svg").default ||
                        require("../../../assets/icon/search.svg"),
                      { width: 24, height: 24 }
                    )}
                    <CardTitle>수면 분석</CardTitle>
                  </CardHeader>

                  {analysisGroups.map((group, idx) =>
                    renderAnalysisBlock(
                      group,
                      idx === analysisGroups.length - 1
                    )
                  )}
                </Card>

                {/* ✅ 수면 분석 밑 가로선 (위/아래 20px) */}
                <SectionDivider />

                {/* 코골이 카드 */}
                <Card>
                  <CardHeader>
                    {React.createElement(
                      require("../../../assets/icon/chart.svg").default ||
                        require("../../../assets/icon/chart.svg"),
                      { width: 24, height: 24 }
                    )}
                    <CardTitle>
                      코골이 구간 {currentSleepData.snoringSegments.length}
                    </CardTitle>
                  </CardHeader>

                  {currentSleepData.snoringSegments.map((segment, index) => (
                    <SnoringItem key={index}>
                      <SnoringTime>{segment.time}</SnoringTime>
                      <SnoringWaveform />
                      <SnoringControls>
                        <PlayButton
                          activeOpacity={0.7}
                          onPress={() => {
                            const updatedSegments = [
                              ...currentSleepData.snoringSegments,
                            ];
                            updatedSegments[index].isPlaying =
                              !updatedSegments[index].isPlaying;
                            saveSleepData(selectedDate, {
                              snoringSegments: updatedSegments,
                            });
                          }}
                        >
                          <Ionicons
                            name={segment.isPlaying ? "pause" : "play"}
                            size={16}
                            color={theme.colors.text}
                          />
                        </PlayButton>
                      </SnoringControls>
                    </SnoringItem>
                  ))}
                </Card>
              </>
            )}

            {activeTab === "diary" && (
              <>
                {/* 수면 메모 섹션 */}
                <SleepMemoSection>
                  <SectionHeader>
                    <SectionTitle>수면 메모</SectionTitle>
                    <AddButton
                      onPress={() => setIsMemoModalVisible(true)}
                      activeOpacity={1}
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color={theme.colors.text}
                      />
                    </AddButton>
                  </SectionHeader>
                  <MemoPillsContainer>
                    {currentSleepData.memoOptions.map((optionId) => {
                      const option = sleepMemoOptions.find(
                        (opt) => opt.id === optionId
                      );
                      if (!option) return null;
                      return (
                        <MemoPill key={optionId}>
                          <SvgIcon
                            Component={option.icon.default || option.icon}
                            width={16}
                            height={16}
                            fill={theme.colors.text}
                          />
                          <MemoPillText>{option.label}</MemoPillText>
                        </MemoPill>
                      );
                    })}
                  </MemoPillsContainer>
                </SleepMemoSection>

                {/* 수면 일기 섹션 */}
                <SleepDiarySection>
                  <DiaryHeader>
                    <SectionTitle>수면 일기</SectionTitle>
                    <EditButton
                      onPress={() => setIsDiaryModalVisible(true)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="pencil"
                        size={20}
                        color={theme.colors.text}
                      />
                    </EditButton>
                  </DiaryHeader>
                  <DiaryInput
                    placeholder="오늘 하루 기억에 남는 일을 작성해 보세요."
                    placeholderTextColor={theme.colors.gray400}
                    value={currentSleepData.diary}
                    onChangeText={() => {}}
                    multiline
                    editable={false}
                    pointerEvents="none"
                  />
                </SleepDiarySection>
              </>
            )}

            {activeTab === "coaching" && (
              <>
                <QuoteIconLeft>
                  <SvgIcon
                    Component={
                      require("../../../assets/icon/quote.svg").default ||
                      require("../../../assets/icon/quote.svg")
                    }
                    width={16}
                    height={16}
                  />
                </QuoteIconLeft>
                <CoachingContainer>
                  <CoachingContent>
                    <CoachingTitleContainer>
                      <CoachingTitle>수면 코칭</CoachingTitle>
                    </CoachingTitleContainer>
                    <CoachingAdviceContainer>
                      <CoachingAdvice>
                        {currentSleepData.coaching}
                      </CoachingAdvice>
                    </CoachingAdviceContainer>
                  </CoachingContent>
                </CoachingContainer>
                <QuoteIconRight>
                  <SvgIcon
                    Component={
                      require("../../../assets/icon/quote2.svg").default ||
                      require("../../../assets/icon/quote2.svg")
                    }
                    width={16}
                    height={16}
                  />
                </QuoteIconRight>
              </>
            )}

            {activeTab === "goal" && (
              <GoalContainer>
                <GoalMessageContainer>
                  <GoalTitleText>나에게 맞는 수면 목표</GoalTitleText>를 정하면
                  {"\n"}더 건강한 하루를 만들 수 있습니다.
                </GoalMessageContainer>

                <Button
                  variant="primary"
                  onPress={() => {
                    // 수면 목표 설정 화면으로 이동하는 로직
                    console.log("수면 목표 설정하기");
                  }}
                >
                  수면 목표 설정하기
                </Button>
              </GoalContainer>
            )}
          </TabContentContainer>
        </Content>
      </ScrollableContent>

      {/* 수면 품질 정보 모달 */}
      <SleepQualityInfoModal
        visible={isQualityModalVisible}
        onClose={() => setIsQualityModalVisible(false)}
      />

      {/* 수면 메모 모달 */}
      <SleepMemoModal
        visible={isMemoModalVisible}
        onClose={() => setIsMemoModalVisible(false)}
        title="수면 메모"
        buttonText="저장"
        selectedOptions={currentSleepData.memoOptions}
        onOptionsChange={(options) => {
          saveSleepData(selectedDate, { memoOptions: options });
          setIsMemoModalVisible(false);
        }}
      />

      {/* 수면 일기 모달 */}
      <SleepDiaryModal
        visible={isDiaryModalVisible}
        onClose={() => setIsDiaryModalVisible(false)}
        title="일기"
        diaryText={currentSleepData.diary}
        onDiaryTextChange={(text) => {
          saveSleepData(selectedDate, { diary: text });
        }}
        onSave={() => {
          setIsDiaryModalVisible(false);
        }}
      />
    </Screen>
  );
};

export default DiaryScreen;
