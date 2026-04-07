import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Svg from "react-native-svg";
import { Circle, Path, Text as SvgText, Line } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SleepQualityInfoModal from "./components/SleepQualityInfoModal";
import SleepMemoModal, { sleepMemoOptions } from "./components/SleepMemoModal";
import SleepDiaryModal from "./components/SleepDiaryModal";
import SvgIcon from "../../shared/components/common/SvgIcon";
import Button from "../../shared/components/common/Button";
import { useFitbitSleepByDate } from "../sleep/hooks/useFitbitSleep";
import Controller from "../../services/controller";
import { getMemberId } from "../../services/authService";

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

const Card = styled.View`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
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

const SectionDivider = styled.View`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.08);
  margin-vertical: 20px;
`;

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
  const [serverSleepDates, setServerSleepDates] = useState<string[]>([]);
  const [allSleepRecords, setAllSleepRecords] = useState<any[]>([]);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const { data: fitbitData } = useFitbitSleepByDate(selectedDate);

  // ✅ 오늘 날짜
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // ✅ 미래 날짜 여부
  const isFutureDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  const getDateKey = (date: Date) => date.toISOString().split("T")[0];

  const getCurrentSleepData = useCallback((): SleepData => {
    const dateKey = getDateKey(selectedDate);
    const existingData = sleepDataMap[dateKey];

    const serverRecord = allSleepRecords.find(
      (r: any) => r.SLEEP_DATE === dateKey,
    );

    if (serverRecord) {
      const start = new Date(serverRecord.START_TIME);
      const end = new Date(serverRecord.END_TIME);
      const toAmPm = (hour: number): "AM" | "PM" => (hour >= 12 ? "PM" : "AM");
      const to12Hour = (hour: number) => hour % 12 || 12;
      const total = serverRecord.MINUTES_ASLEEP;
      const deepPct =
        total > 0
          ? Math.round((serverRecord.DEEP_SLEEP_MINUTES / total) * 100)
          : 0;
      const lightPct =
        total > 0
          ? Math.round((serverRecord.LIGHT_SLEEP_MINUTES / total) * 100)
          : 0;
      const remPct =
        total > 0
          ? Math.round((serverRecord.REM_SLEEP_MINUTES / total) * 100)
          : 0;
      const wakePct =
        total > 0 ? Math.round((serverRecord.WAKE_MINUTES / total) * 100) : 0;

      return {
        quality: serverRecord.EFFICIENCY,
        totalSleepTime: { hours: Math.floor(total / 60), minutes: total % 60 },
        timeInBed: {
          hours: Math.floor(serverRecord.TIME_IN_BED / 60),
          minutes: serverRecord.TIME_IN_BED % 60,
        },
        sleepGoal: existingData?.sleepGoal ?? { hours: 7, minutes: 30 },
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
          sleepLatency: `${serverRecord.SLEEP_LATENCY_MINUTES ?? 0}분`,
          deepSleep: `${deepPct}%`,
          lightSleep: `${lightPct}%`,
          remSleep: `${remPct}%`,
          awakeTime: `${wakePct}%`,
          snoring: "-",
        },
        snoringSegments: existingData?.snoringSegments ?? [],
        coaching: existingData?.coaching ?? "수면 데이터를 분석 중입니다.",
        memoOptions: existingData?.memoOptions ?? [],
        diary: existingData?.diary ?? "",
      };
    }

    if (existingData) return existingData;

    const dayOfMonth = selectedDate.getDate();
    const baseQuality = 65 + (dayOfMonth % 20);
    const baseHours = 6 + Math.floor(dayOfMonth % 3);
    const baseMinutes = 30 + (dayOfMonth % 30);

    return {
      quality: Math.min(100, baseQuality),
      totalSleepTime: { hours: baseHours, minutes: baseMinutes },
      timeInBed: { hours: baseHours + 1, minutes: (baseMinutes + 20) % 60 },
      sleepGoal: { hours: 7, minutes: 30 },
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
        regularity: "-",
        heartRate: "-",
        temperatureChange: "-",
        temperatureStability: "-",
        sleepLatency: "-",
        deepSleep: "-",
        lightSleep: "-",
        remSleep: "-",
        awakeTime: "-",
        snoring: "-",
      },
      snoringSegments: [],
      coaching: "수면 데이터를 분석 중입니다.",
      memoOptions: [],
      diary: "",
    };
  }, [selectedDate, sleepDataMap, allSleepRecords]);

  const currentSleepData = getCurrentSleepData();

  const saveSleepData = useCallback(
    async (date: Date, data: Partial<SleepData>) => {
      const dateKey = getDateKey(date);
      const updatedData = { ...currentSleepData, ...data };
      const newDataMap = { ...sleepDataMap, [dateKey]: updatedData };
      setSleepDataMap(newDataMap);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDataMap));
      } catch (error) {
        console.error("데이터 저장 실패:", error);
      }
    },
    [currentSleepData, sleepDataMap],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setSleepDataMap(JSON.parse(stored));

        const memberId = await getMemberId();
        const _controller = new Controller({
          modelName: "SleepRecord",
          modelId: "sleep_record",
        });
        const res = await _controller.findAll({
          APP_MEMBER_IDENTIFICATION_CODE: memberId,
        });
        console.log("findAll 응답:", JSON.stringify(res?.data, null, 2)); // ✅ 추가

        if (res?.result) {
          setAllSleepRecords(res.result.rows);
          const dates = res.result.rows.map((r: any) => r.SLEEP_DATE);
          setServerSleepDates(dates);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    loadData();
  }, []);

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
    return `${weekdays[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}일`;
  };

  const calculateTimeDifference = () => {
    const { totalSleepTime, sleepGoal } = currentSleepData;
    const totalMinutes = totalSleepTime.hours * 60 + totalSleepTime.minutes;
    const goalMinutes = sleepGoal.hours * 60 + sleepGoal.minutes;
    const diffMinutes = totalMinutes - goalMinutes;
    if (diffMinutes === 0) return "목표 달성";
    const absDiff = Math.abs(diffMinutes);
    const hours = Math.floor(absDiff / 60);
    const minutes = absDiff % 60;
    const sign = diffMinutes > 0 ? "+" : "-";
    if (hours > 0 && minutes > 0) return `${sign}${hours}시간 ${minutes}분`;
    if (hours > 0) return `${sign}${hours}시간`;
    return `${sign}${minutes}분`;
  };

  const getWeekDates = (date: Date) => {
    const currentDay = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - currentDay);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) dates.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      dates.push(new Date(year, month, i));
    return dates;
  };

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const monthDates = useMemo(() => getMonthDates(selectedDate), [selectedDate]);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const hasData = (date: Date) => {
    const dateKey = getDateKey(date);
    return !!sleepDataMap[dateKey] || serverSleepDates.includes(dateKey);
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

  const analysisGroups = useMemo(() => {
    const { analysis, bedtime, wakeTime } = currentSleepData;
    const bedtimeStr = `${bedtime.ampm === "AM" ? "오전" : "오후"} ${bedtime.hour}:${bedtime.minute.toString().padStart(2, "0")}`;
    const wakeTimeStr = `${wakeTime.ampm === "AM" ? "오전" : "오후"} ${wakeTime.hour}:${wakeTime.minute.toString().padStart(2, "0")}`;
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
        { label: "자다 깸", value: analysis.awakeTime },
        { label: "렘수면", value: analysis.remSleep },
      ],
    ];
  }, [currentSleepData]);

  const renderAnalysisBlock = (
    items: { label: string; value: string }[],
    isLast?: boolean,
  ) => (
    <View style={{ marginBottom: isLast ? 0 : 16 }}>
      <AnalysisTable>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {items.map((item, idx) => (
            <AnalysisCell
              key={`${item.label}-${idx}`}
              showRightBorder={idx % 2 === 0}
              showBottomBorder={idx < 2}
            >
              <AnalysisCellLabel>{item.label}</AnalysisCellLabel>
              <AnalysisCellValue>{item.value}</AnalysisCellValue>
            </AnalysisCell>
          ))}
        </View>
      </AnalysisTable>
    </View>
  );

  const generateSleepStageData = useCallback(() => {
    const dateKey = getDateKey(selectedDate);
    const serverRecord = allSleepRecords.find(
      (r: any) => r.SLEEP_DATE === dateKey,
    );

    if (serverRecord?.SLEEP_LEVELS_DATA?.length > 0) {
      const levels = serverRecord.SLEEP_LEVELS_DATA;
      const points = Math.min(levels.length, 50);
      const step = Math.max(1, Math.floor(levels.length / points));
      const lightSleep: number[] = [];
      const deepSleep: number[] = [];
      for (let i = 0; i < points; i++) {
        const level = levels[Math.min(i * step, levels.length - 1)];
        switch (level.level) {
          case "deep":
            lightSleep.push(0.2);
            deepSleep.push(0.7);
            break;
          case "light":
            lightSleep.push(0.5);
            deepSleep.push(0.0);
            break;
          case "rem":
            lightSleep.push(0.4);
            deepSleep.push(0.2);
            break;
          case "wake":
          default:
            lightSleep.push(0.0);
            deepSleep.push(0.0);
            break;
        }
      }
      return { lightSleep, deepSleep };
    }

    const dayOfMonth = selectedDate.getDate();
    const points = 50;
    const lightSleep: number[] = [];
    const deepSleep: number[] = [];
    for (let i = 0; i < points; i++) {
      const variation = Math.sin(i * 0.3 + dayOfMonth * 0.1) * 0.15;
      if (i < 5) {
        lightSleep.push(0);
        deepSleep.push(0);
      } else if (i < 15) {
        const p = (i - 5) / 10;
        lightSleep.push(0.3 + p * 0.4 + variation);
        deepSleep.push(0);
      } else if (i < 30) {
        const p = (i - 15) / 15;
        deepSleep.push(Math.sin(p * Math.PI) * 0.6 + variation * 0.5);
        lightSleep.push(0.2 + variation);
      } else if (i < 40) {
        const p = (i - 30) / 10;
        lightSleep.push(0.3 + p * 0.3 + variation);
        deepSleep.push(0.1 - p * 0.1);
      } else {
        lightSleep.push(0.5 + variation);
        deepSleep.push(0);
      }
    }
    return { lightSleep, deepSleep };
  }, [selectedDate, allSleepRecords]);

  const sleepStageData = generateSleepStageData();

  const renderSleepStageGraph = () => {
    const graphWidth = 300;
    const graphHeight = 96;
    const padding = 12;
    const chartWidth = graphWidth - padding * 2;
    const chartHeight = graphHeight - padding * 2;
    const { lightSleep, deepSleep } = sleepStageData;
    const points = lightSleep.length;
    const pointSpacing = chartWidth / (points - 1);

    const getY = (value: number) =>
      padding + chartHeight - Math.max(0, Math.min(1, value)) * chartHeight;

    const createLinePath = (values: number[]) => {
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
          path += ` C ${prevX + (x - prevX) * 0.5} ${prevY}, ${x - (nextX - x) * 0.5} ${nextY}, ${x} ${y}`;
        }
      }
      return path;
    };

    const createAreaPath = (values: number[]) => {
      let path = `M ${padding} ${padding + chartHeight}`;
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
          path += ` C ${prevX + (x - prevX) * 0.5} ${prevY}, ${x - (nextX - x) * 0.5} ${nextY}, ${x} ${y}`;
        }
      }
      path += ` L ${padding + (values.length - 1) * pointSpacing} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;
      return path;
    };

    const combinedSleep = lightSleep.map((light, i) =>
      Math.min(1, light + deepSleep[i]),
    );
    const dateKey = getDateKey(selectedDate);
    const serverRecord = allSleepRecords.find(
      (r: any) => r.SLEEP_DATE === dateKey,
    );

    return (
      <GraphContainer>
        <Svg width={graphWidth} height={graphHeight}>
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
          <Path
            d={createAreaPath(combinedSleep)}
            fill="#7353FF"
            fillOpacity="0.3"
          />
          <Path
            d={createAreaPath(deepSleep)}
            fill="#25C3FB"
            fillOpacity="0.5"
          />
          <Path
            d={createLinePath(lightSleep)}
            fill="none"
            stroke="#7353FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={createLinePath(deepSleep)}
            fill="none"
            stroke="#25C3FB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <SvgText
            x={padding}
            y={graphHeight - 2}
            fontSize="10"
            fill={theme.colors.textSecondary}
          >
            {serverRecord ? "취침" : "2am"}
          </SvgText>
          <SvgText
            x={padding + chartWidth}
            y={graphHeight - 2}
            fontSize="10"
            fill={theme.colors.textSecondary}
            textAnchor="end"
          >
            {serverRecord
              ? `${currentSleepData.wakeTime.hour}시 (기상)`
              : "7 (시간)"}
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
                        const isFuture = isFutureDate(date); // ✅
                        return (
                          <DateItemContainer key={index}>
                            <DateItem
                              selected={isSelected}
                              hasData={dateHasData}
                              onPress={() => !isFuture && setSelectedDate(date)} // ✅
                              activeOpacity={isFuture ? 1 : 0.7} // ✅
                              style={{ opacity: isFuture ? 0.3 : 1 }} // ✅
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
                        const isFuture = isFutureDate(date); // ✅
                        return (
                          <DateItemContainer key={index}>
                            <DateItem
                              selected={isSelected}
                              hasData={dateHasData}
                              onPress={() => !isFuture && setSelectedDate(date)} // ✅
                              activeOpacity={isFuture ? 1 : 0.7} // ✅
                              style={{ opacity: isFuture ? 0.3 : 1 }} // ✅
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
                  require("../../../assets/icon/question-circle.svg").default ||
                  require("../../../assets/icon/question-circle.svg")
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
              {(["analysis", "diary", "coaching", "goal"] as TabKey[]).map(
                (tab) => (
                  <Tab
                    key={tab}
                    active={activeTab === tab}
                    onPress={() => setActiveTab(tab)}
                    activeOpacity={1}
                  >
                    <TabText active={activeTab === tab}>
                      {tab === "analysis"
                        ? "분석"
                        : tab === "diary"
                          ? "일지"
                          : tab === "coaching"
                            ? "코칭"
                            : "수면 목표"}
                    </TabText>
                  </Tab>
                ),
              )}
            </TabsContainer>

            {activeTab === "analysis" && (
              <>
                <Card>
                  <CardHeader>
                    {React.createElement(
                      require("../../../assets/icon/activity.svg").default ||
                        require("../../../assets/icon/activity.svg"),
                      { width: 24, height: 24 },
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

                <SectionDivider />

                <Card>
                  <CardHeader>
                    {React.createElement(
                      require("../../../assets/icon/search.svg").default ||
                        require("../../../assets/icon/search.svg"),
                      { width: 24, height: 24 },
                    )}
                    <CardTitle>수면 분석</CardTitle>
                  </CardHeader>
                  {analysisGroups.map((group, idx) =>
                    renderAnalysisBlock(
                      group,
                      idx === analysisGroups.length - 1,
                    ),
                  )}
                </Card>

                <SectionDivider />

                {/* <Card>
                  <CardHeader>
                    {React.createElement(
                      require("../../../assets/icon/chart.svg").default ||
                        require("../../../assets/icon/chart.svg"),
                      { width: 24, height: 24 },
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
                </Card> */}
              </>
            )}

            {activeTab === "diary" && (
              <>
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
                        (opt: any) => opt.id === optionId,
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

                <SleepDiarySection>
                  <DiaryHeader>
                    <SectionTitle>수면 다이어리</SectionTitle>
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
                  onPress={() => console.log("수면 목표 설정하기")}
                >
                  수면 목표 설정하기
                </Button>
              </GoalContainer>
            )}
          </TabContentContainer>
        </Content>
      </ScrollableContent>

      <SleepQualityInfoModal
        visible={isQualityModalVisible}
        onClose={() => setIsQualityModalVisible(false)}
      />
      <SleepMemoModal
        visible={isMemoModalVisible}
        onClose={() => setIsMemoModalVisible(false)}
        title="수면 메모"
        buttonText="저장"
        selectedOptions={currentSleepData.memoOptions}
        onOptionsChange={(options) =>
          saveSleepData(selectedDate, { memoOptions: options })
        }
      />
      <SleepDiaryModal
        visible={isDiaryModalVisible}
        onClose={() => setIsDiaryModalVisible(false)}
        title="수면 다이어리"
        diaryText={currentSleepData.diary}
        onDiaryTextChange={(text) =>
          saveSleepData(selectedDate, { diary: text })
        }
        onSave={() => setIsDiaryModalVisible(false)}
      />
    </Screen>
  );
};

export default DiaryScreen;
