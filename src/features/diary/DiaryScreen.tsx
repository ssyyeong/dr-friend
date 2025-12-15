import React, { useState, useRef, useMemo } from "react";
import { Animated, View, TextInput } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Svg from "react-native-svg";
import { Circle } from "react-native-svg";
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
// Component
// =====================

type TabKey = "analysis" | "diary" | "coaching" | "goal";

const DiaryScreen = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("analysis");
  const [isQualityModalVisible, setIsQualityModalVisible] = useState(false);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
  const [isDiaryModalVisible, setIsDiaryModalVisible] = useState(false);
  const [selectedMemoOptions, setSelectedMemoOptions] = useState<string[]>([]);
  const [diaryText, setDiaryText] = useState("");
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 수면 품질 데이터
  const sleepQuality = 71; // 71%
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
    return "-2시간 30분";
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getMonthDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const dates: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) dates.push(null);
    for (let i = 1; i <= daysInMonth; i++) dates.push(new Date(year, month, i));
    return dates;
  };

  const weekDates = useMemo(() => getWeekDates(), []);
  const monthDates = useMemo(() => getMonthDates(), []);

  const hasData = (date: Date) => {
    const day = date.getDate();
    return day === 18 || day === 19;
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

  // ✅ 4개씩 묶어서 3블록
  const analysisGroups = [
    [
      { label: "수면 규칙성", value: "90%" },
      { label: "심박수", value: "63" },
      { label: "체온 변화", value: "2°C" },
      { label: "체온 안정성", value: "36°C / 50%" },
    ],
    [
      { label: "잠들기까지", value: "21분" },
      { label: "취침 시간", value: "오전 2:10" },
      { label: "기상 시간", value: "오전 08:00" },
      { label: "코골기", value: "3시간 15분" },
    ],
    [
      { label: "깊은 수면", value: "25%" },
      { label: "얕은 수면", value: "51%" },
      { label: "기상 시간", value: "25%" },
      { label: "렘수면", value: "51%" },
    ],
  ];

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
                  <SleepSummaryValue>6시간 44분</SleepSummaryValue>
                </SleepSummaryItem>
                <SleepSummaryItem>
                  <SleepSummaryLabel>침대에 머문 시간</SleepSummaryLabel>
                  <SleepSummaryValue>7시간 16분</SleepSummaryValue>
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

                  <SleepStageGraph />

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
                    <CardTitle>코골이 구간 2</CardTitle>
                  </CardHeader>

                  <SnoringItem>
                    <SnoringTime>02:14 AM</SnoringTime>
                    <SnoringWaveform />
                    <SnoringControls>
                      <PlayButton activeOpacity={0.7}>
                        <Ionicons
                          name="play"
                          size={16}
                          color={theme.colors.text}
                        />
                      </PlayButton>
                    </SnoringControls>
                  </SnoringItem>

                  <SnoringItem>
                    <SnoringTime>03:45 AM</SnoringTime>
                    <SnoringWaveform />
                    <SnoringControls>
                      <PlayButton activeOpacity={0.7}>
                        <Ionicons
                          name="pause"
                          size={16}
                          color={theme.colors.text}
                        />
                      </PlayButton>
                    </SnoringControls>
                  </SnoringItem>
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
                    {selectedMemoOptions.map((optionId) => {
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
                    value={diaryText}
                    onChangeText={setDiaryText}
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
                        깊은 잠이 줄어들었습니다.{"\n"}저녁에는 휴대폰 사용을
                        줄이고, 따뜻한 차로 마음을 안정시켜보세요.
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
        selectedOptions={selectedMemoOptions}
        onOptionsChange={setSelectedMemoOptions}
      />

      {/* 수면 일기 모달 */}
      <SleepDiaryModal
        visible={isDiaryModalVisible}
        onClose={() => setIsDiaryModalVisible(false)}
        title="일기"
        diaryText={diaryText}
        onDiaryTextChange={setDiaryText}
        onSave={() => {
          // 저장 로직이 필요하면 여기에 추가
        }}
      />
    </Screen>
  );
};

export default DiaryScreen;
