import React, { useState, useRef, useMemo, useCallback } from "react";
import { ScrollView, Modal } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import Header from "../../../shared/components/common/Header";
import ToggleSwitch from "../../../shared/components/common/ToggleSwitch";
import { getMemberId } from "../../../services/authService";
import Controller from "../../../services/controller";

type Props = NativeStackScreenProps<ProfileStackParamList, "SleepGoalForm">;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled(ScrollView)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  padding-bottom: 100px;
`;

const InstructionBox = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray700};
  padding: 12px 16px;
  margin-bottom: 24px;
`;

const InstructionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 25.6px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const ActivationButtonsContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ActivationButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  padding: 16px 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(115, 83, 255, 0.20)" : "rgba(79, 107, 145, 0.24)"};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: ${({ isSelected }) => (isSelected ? 1 : 0)}px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : "transparent"};
  flex-direction: row;
  justify-content: space-between;
`;

const ActivationButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
`;

const DaysContainer = styled.View`
  flex-direction: row;
  gap: 4px;
`;

const DayButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  height: 40px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : "transparent"};
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
`;

const DayButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
`;

const TimeSettingCard = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
  margin-bottom: 12px;
`;

const TimeSettingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TimeSettingLabel = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const TimeDisplay = styled.TouchableOpacity`
  align-items: flex-end;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const TimeDisplayText = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SettingLabel = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.gray600};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const DropdownText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const SummaryContainer = styled.View`
  padding: 20px 0;
  align-items: center;
`;

const SummaryText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 7px;
  line-height: 32px;
`;

const SummaryTimeText = styled.Text<{ highlight?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ highlight, theme }) =>
    highlight ? theme.colors.secondary : theme.colors.warning};
  line-height: 32px;
`;

const SummarySubText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
  line-height: 25.6px;
`;

// 모달 스타일
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: flex-end;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
`;

const OverlayTouchable = styled.TouchableOpacity`
  flex: 1;
`;

const ModalCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray800};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 20px;
  max-height: 80%;
  z-index: 10000;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

const TimePickerContainer = styled.View`
  height: 300px;
  position: relative;
  margin-bottom: 24px;
`;

const TimePickerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const PickerColumn = styled.View`
  flex: 1;
  height: 100%;
  position: relative;
`;

const PickerScrollView = styled.ScrollView.attrs(() => ({}))`
  flex: 1;
`;

const SelectionIndicator = styled.View`
  position: absolute;
  top: 125px;
  left: 0;
  right: 0;
  height: 50px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray600};
  pointer-events: none;
`;

const PickerItem = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
`;

const PickerItemText = styled.Text<{ isSelected: boolean }>`
  font-size: 24px;
  font-weight: ${({ isSelected }) => (isSelected ? "700" : "400")};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.text : theme.colors.gray400};
`;

const TimeSeparator = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 8px;
  height: 50px;
  line-height: 50px;
`;

const AlarmTypeModalContent = styled.View`
  padding: 20px 0;
`;

const AlarmTypeOption = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 16px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : "transparent"};
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 8px;
`;

const AlarmTypeOptionText = styled.Text<{ isSelected: boolean }>`
  font-size: 18px;
  font-weight: ${({ isSelected }) => (isSelected ? "600" : "400")};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.text : theme.colors.gray300};
`;

const ITEM_HEIGHT = 50;

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const ALARM_TYPES = {
  WAKE: ["정기 알림", "스마트 알림", "앱 내 알림"],
  BEDTIME: ["정기 알림", "스마트 알림", "앱 내 알림"],
};

// 알림 유형 변환 맵
const ALARM_TYPE_MAP: Record<string, string> = {
  "정기 알림": "REGULAR",
  "스마트 알림": "SMART",
  "앱 내 알림": "IN_APP",
  REGULAR: "정기 알림",
  SMART: "스마트 알림",
  IN_APP: "앱 내 알림",
};

// 24시간 형식을 AM/PM 형식으로 변환
const convert24To12 = (hour24: number): { hour: number; ampm: "AM" | "PM" } => {
  if (hour24 === 0) return { hour: 12, ampm: "AM" };
  if (hour24 < 12) return { hour: hour24, ampm: "AM" };
  if (hour24 === 12) return { hour: 12, ampm: "PM" };
  return { hour: hour24 - 12, ampm: "PM" };
};

// AM/PM 형식을 24시간 형식으로 변환
const convert12To24 = (hour: number, ampm: "AM" | "PM"): number => {
  if (ampm === "AM") {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
};

// 한글 요일명을 숫자 인덱스로 변환
const dayNameToIndex = (dayName: string): number => {
  return DAYS.indexOf(dayName);
};

// 숫자 인덱스를 한글 요일명으로 변환
const indexToDayName = (index: number): string => {
  return DAYS[index];
};

const SleepGoalFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const mode = route.params?.mode || "create";
  const sleepGoal = route.params?.sleepGoal;

  // 수면 목표 활성화
  const [isActive, setIsActive] = useState(sleepGoal?.isActive ?? true);

  // 요일 선택
  const [selectedDays, setSelectedDays] = useState<Set<number>>(
    sleepGoal?.selectedDays ? new Set(sleepGoal.selectedDays) : new Set([0, 6]) // 일요일, 토요일 기본 선택
  );

  // 기상 시간
  const [wakeHour, setWakeHour] = useState(sleepGoal?.wakeHour ?? 7);
  const [wakeMinute, setWakeMinute] = useState(sleepGoal?.wakeMinute ?? 41);
  const [wakeAmPm, setWakeAmPm] = useState<"AM" | "PM">(
    sleepGoal?.wakeAmPm ?? "AM"
  );
  const [wakeAlarmEnabled, setWakeAlarmEnabled] = useState(
    sleepGoal?.wakeAlarmEnabled ?? true
  );
  const [wakeAlarmType, setWakeAlarmType] = useState(
    sleepGoal?.wakeAlarmType ?? "정기 알림"
  );
  const [wakeTimeModalVisible, setWakeTimeModalVisible] = useState(false);

  // 취침 시간
  const [bedtimeHour, setBedtimeHour] = useState(sleepGoal?.bedtimeHour ?? 11);
  const [bedtimeMinute, setBedtimeMinute] = useState(
    sleepGoal?.bedtimeMinute ?? 0
  );
  const [bedtimeAmPm, setBedtimeAmPm] = useState<"AM" | "PM">(
    sleepGoal?.bedtimeAmPm ?? "PM"
  );
  const [bedtimeAlarmEnabled, setBedtimeAlarmEnabled] = useState(
    sleepGoal?.bedtimeAlarmEnabled ?? true
  );
  const [bedtimeAlarmType, setBedtimeAlarmType] = useState(
    sleepGoal?.bedtimeAlarmType ?? "앱 내 알림"
  );
  const [bedtimeTimeModalVisible, setBedtimeTimeModalVisible] = useState(false);

  // 알림 유형 모달
  const [alarmTypeModalVisible, setAlarmTypeModalVisible] = useState(false);
  const [currentAlarmType, setCurrentAlarmType] = useState<"wake" | "bedtime">(
    "wake"
  );

  // 스크롤 뷰 refs
  const wakeHourScrollRef = useRef<ScrollView | null>(null);
  const wakeMinuteScrollRef = useRef<ScrollView | null>(null);
  const wakeAmPmScrollRef = useRef<ScrollView | null>(null);
  const bedtimeHourScrollRef = useRef<ScrollView | null>(null);
  const bedtimeMinuteScrollRef = useRef<ScrollView | null>(null);
  const bedtimeAmPmScrollRef = useRef<ScrollView | null>(null);

  // 수정 모드일 때 사용할 ID 저장
  const [sleepGoalId, setSleepGoalId] = useState<number | null>(
    sleepGoal?.SLEEP_GOAL_IDENTIFICATION_CODE || null
  );

  // 수정 모드일 때 데이터 불러오기
  useFocusEffect(
    useCallback(() => {
      const fetchSleepGoal = async () => {
        if (mode !== "edit") return;

        const memberId = await getMemberId();
        if (!memberId) return;

        try {
          const controller = new Controller({
            modelName: "SleepGoal",
            modelId: "sleep_goal",
          });
          const response = await controller.findAll({
            APP_MEMBER_IDENTIFICATION_CODE: memberId,
          });

          if (response?.status === 200 && response?.result?.rows?.length > 0) {
            const sleepGoalData = response.result.rows[0];

            // 수면 목표 ID 저장 (수정 시 사용)
            if (sleepGoalData.SLEEP_GOAL_IDENTIFICATION_CODE) {
              setSleepGoalId(sleepGoalData.SLEEP_GOAL_IDENTIFICATION_CODE);
            }

            // 수면 목표 활성화 설정 ('Y'/'N' → boolean)
            setIsActive(sleepGoalData.IS_ACTIVE === "Y");

            // 요일 설정 (JSON 배열의 한글 요일명 → 숫자 인덱스)
            if (
              sleepGoalData.ACTIVE_DAYS &&
              Array.isArray(sleepGoalData.ACTIVE_DAYS)
            ) {
              const dayIndices = sleepGoalData.ACTIVE_DAYS.map(
                (dayName: string) => dayNameToIndex(dayName)
              ).filter((idx: number) => idx !== -1);
              setSelectedDays(new Set(dayIndices));
            }

            // 기상 시간 설정 (24시간 형식 → AM/PM 형식)
            if (sleepGoalData.WAKEUP_HOUR !== undefined) {
              const wakeTime = convert24To12(sleepGoalData.WAKEUP_HOUR);
              setWakeHour(wakeTime.hour);
              setWakeAmPm(wakeTime.ampm);
            }
            if (sleepGoalData.WAKEUP_MINUTE !== undefined) {
              setWakeMinute(sleepGoalData.WAKEUP_MINUTE);
            }
            // 기상 알림 설정 ('Y'/'N' → boolean)
            if (sleepGoalData.WAKEUP_ALARM_ENABLED !== undefined) {
              setWakeAlarmEnabled(sleepGoalData.WAKEUP_ALARM_ENABLED === "Y");
            }
            // 기상 알림 유형 설정 (영문 코드 → 한글)
            if (sleepGoalData.WAKEUP_ALARM_TYPE) {
              setWakeAlarmType(
                ALARM_TYPE_MAP[sleepGoalData.WAKEUP_ALARM_TYPE] || "정기 알림"
              );
            }

            // 취침 시간 설정 (24시간 형식 → AM/PM 형식)
            if (sleepGoalData.BEDTIME_HOUR !== undefined) {
              const bedtimeTime = convert24To12(sleepGoalData.BEDTIME_HOUR);
              setBedtimeHour(bedtimeTime.hour);
              setBedtimeAmPm(bedtimeTime.ampm);
            }
            if (sleepGoalData.BEDTIME_MINUTE !== undefined) {
              setBedtimeMinute(sleepGoalData.BEDTIME_MINUTE);
            }
            // 취침 알림 설정 ('Y'/'N' → boolean)
            if (sleepGoalData.BEDTIME_ALARM_ENABLED !== undefined) {
              setBedtimeAlarmEnabled(
                sleepGoalData.BEDTIME_ALARM_ENABLED === "Y"
              );
            }
            // 취침 알림 유형 설정 (영문 코드 → 한글)
            if (sleepGoalData.BEDTIME_ALARM_TYPE) {
              setBedtimeAlarmType(
                ALARM_TYPE_MAP[sleepGoalData.BEDTIME_ALARM_TYPE] || "앱 내 알림"
              );
            }
          }
        } catch (error) {
          console.error("수면 목표 데이터 불러오기 실패:", error);
        }
      };

      fetchSleepGoal();
    }, [mode])
  );

  // 시간 포맷팅
  const formatTime = (
    hour: number,
    minute: number,
    ampm: "AM" | "PM"
  ): string => {
    const ampmText = ampm === "AM" ? "오전" : "오후";
    return `${ampmText} ${hour} : ${minute.toString().padStart(2, "0")}`;
  };

  // 수면 시간 계산
  const sleepHours = useMemo(() => {
    let wakeMinutes = wakeHour * 60 + wakeMinute;
    if (wakeAmPm === "PM" && wakeHour !== 12) wakeMinutes += 12 * 60;
    if (wakeAmPm === "AM" && wakeHour === 12) wakeMinutes -= 12 * 60;

    let bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute;
    if (bedtimeAmPm === "PM" && bedtimeHour !== 12) bedtimeMinutes += 12 * 60;
    if (bedtimeAmPm === "AM" && bedtimeHour === 12) bedtimeMinutes -= 12 * 60;

    // 취침 시간이 기상 시간보다 늦으면 (예: 취침 23시, 기상 7시)
    // 기상 시간을 다음날로 계산 (기상 시간에 24시간 추가)
    if (bedtimeMinutes > wakeMinutes) {
      wakeMinutes += 24 * 60;
    }

    const diffMinutes = wakeMinutes - bedtimeMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return { hours, minutes, totalMinutes: diffMinutes };
  }, [wakeHour, wakeMinute, wakeAmPm, bedtimeHour, bedtimeMinute, bedtimeAmPm]);

  // 요일 토글
  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  // 시간 선택 모달 열기
  const openTimeModal = (type: "wake" | "bedtime") => {
    if (type === "wake") {
      setWakeTimeModalVisible(true);
      // 초기 스크롤 위치 설정
      setTimeout(() => {
        wakeHourScrollRef.current?.scrollTo({
          y: (wakeHour - 1) * ITEM_HEIGHT,
          animated: false,
        });
        wakeMinuteScrollRef.current?.scrollTo({
          y: wakeMinute * ITEM_HEIGHT,
          animated: false,
        });
        wakeAmPmScrollRef.current?.scrollTo({
          y: wakeAmPm === "AM" ? 0 : ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    } else {
      setBedtimeTimeModalVisible(true);
      setTimeout(() => {
        bedtimeHourScrollRef.current?.scrollTo({
          y: (bedtimeHour - 1) * ITEM_HEIGHT,
          animated: false,
        });
        bedtimeMinuteScrollRef.current?.scrollTo({
          y: bedtimeMinute * ITEM_HEIGHT,
          animated: false,
        });
        bedtimeAmPmScrollRef.current?.scrollTo({
          y: bedtimeAmPm === "AM" ? 0 : ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  };

  // 시간 스크롤 핸들러
  const handleHourScroll = (
    event: any,
    setHour: (hour: number) => void,
    type: "wake" | "bedtime"
  ) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newHour = Math.max(1, Math.min(12, index + 1));
    setHour(newHour);
  };

  const handleHourScrollEnd = (
    event: any,
    setHour: (hour: number) => void,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newHour = Math.max(1, Math.min(12, index + 1));
    const targetY = (newHour - 1) * ITEM_HEIGHT;

    setHour(newHour);

    scrollRef.current?.scrollTo({
      y: targetY,
      animated: false,
    });

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

  const handleMinuteScroll = (
    event: any,
    setMinute: (minute: number) => void
  ) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newMinute = Math.max(0, Math.min(59, index));
    setMinute(newMinute);
  };

  const handleMinuteScrollEnd = (
    event: any,
    setMinute: (minute: number) => void,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newMinute = Math.max(0, Math.min(59, index));
    const targetY = newMinute * ITEM_HEIGHT;

    setMinute(newMinute);

    scrollRef.current?.scrollTo({
      y: targetY,
      animated: false,
    });

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

  const handleAmPmScroll = (
    event: any,
    setAmPm: (ampm: "AM" | "PM") => void
  ) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(1, index));
    const newAmPm = clampedIndex === 0 ? "AM" : "PM";
    setAmPm(newAmPm);
  };

  const handleAmPmScrollEnd = (
    event: any,
    setAmPm: (ampm: "AM" | "PM") => void,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(1, index));
    const newAmPm = clampedIndex === 0 ? "AM" : "PM";
    const targetY = clampedIndex * ITEM_HEIGHT;

    setAmPm(newAmPm);

    scrollRef.current?.scrollTo({
      y: targetY,
      animated: false,
    });

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

  // 피커 아이템 렌더링
  const renderPickerItems = (
    items: (string | number)[],
    selectedValue: string | number,
    onScroll: (event: any) => void,
    onScrollEnd: (event: any) => void,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    return (
      <PickerColumn>
        <SelectionIndicator />
        <PickerScrollView
          ref={scrollRef as any}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate={0.9}
          onScroll={onScroll}
          onMomentumScrollEnd={onScrollEnd}
          onScrollEndDrag={onScrollEnd}
          bounces={false}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: ITEM_HEIGHT,
            paddingBottom: ITEM_HEIGHT,
          }}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <PickerItem key={index} style={{ height: ITEM_HEIGHT }}>
                <PickerItemText isSelected={isSelected}>
                  {typeof item === "number"
                    ? item.toString().padStart(2, "0")
                    : item}
                </PickerItemText>
              </PickerItem>
            );
          })}
        </PickerScrollView>
      </PickerColumn>
    );
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      const memberId = await getMemberId();
      if (!memberId) {
        console.error("회원 ID를 찾을 수 없습니다.");
        return;
      }

      // 24시간 형식으로 변환
      const wakeupHour24 = convert12To24(wakeHour, wakeAmPm);
      const bedtimeHour24 = convert12To24(bedtimeHour, bedtimeAmPm);

      // 수면 목표 시간 계산 (시간 단위)
      let wakeupMinutes = wakeupHour24 * 60 + wakeMinute;
      let bedtimeMinutes = bedtimeHour24 * 60 + bedtimeMinute;

      // 취침 시간이 기상 시간보다 늦으면 (예: 취침 23시, 기상 7시)
      // 기상 시간을 다음날로 계산 (기상 시간에 24시간 추가)
      if (bedtimeMinutes > wakeupMinutes) {
        wakeupMinutes += 24 * 60;
      }

      // 수면 시간 = 기상 시간 - 취침 시간
      const sleepGoalHours = Math.floor((wakeupMinutes - bedtimeMinutes) / 60);
      // 요일 배열 변환 (숫자 인덱스 → 한글 요일명) 및 정렬
      // 일요일(0)을 제외한 나머지는 오름차순, 일요일은 마지막에 배치
      const activeDays = Array.from(selectedDays)
        .sort((a, b) => {
          // 일요일(0)은 항상 마지막
          if (a === 0) return 1;
          if (b === 0) return -1;
          // 나머지는 오름차순 정렬
          return a - b;
        })
        .map((idx) => indexToDayName(idx))
        .filter((day) => day !== undefined);
      // 저장할 데이터 구성
      const saveData: any = {
        APP_MEMBER_IDENTIFICATION_CODE: memberId,
        IS_ACTIVE: isActive ? "Y" : "N",
        ACTIVE_DAYS: activeDays,
        SLEEP_GOAL_HOURS: sleepGoalHours,
        WAKEUP_HOUR: wakeupHour24,
        WAKEUP_MINUTE: wakeMinute,
        WAKEUP_ALARM_ENABLED: wakeAlarmEnabled ? "Y" : "N",
        WAKEUP_ALARM_TYPE: ALARM_TYPE_MAP[wakeAlarmType] || "REGULAR",
        BEDTIME_HOUR: bedtimeHour24,
        BEDTIME_MINUTE: bedtimeMinute,
        BEDTIME_ALARM_ENABLED: bedtimeAlarmEnabled ? "Y" : "N",
        BEDTIME_ALARM_TYPE: ALARM_TYPE_MAP[bedtimeAlarmType] || "IN_APP",
      };

      // 수정 모드일 경우 SLEEP_GOAL_IDENTIFICATION_CODE 추가
      if (mode === "edit" && sleepGoalId) {
        saveData.SLEEP_GOAL_IDENTIFICATION_CODE = sleepGoalId;
      }

      const controller = new Controller({
        modelName: "SleepGoal",
        modelId: "sleep_goal",
      });

      if (mode === "edit") {
        const response = await controller.update({
          ...saveData,
          SLEEP_GOAL_IDENTIFICATION_CODE: sleepGoalId,
        });
        if (response?.status === 200) {
          navigation.goBack();
        }
      } else {
        const response = await controller.create(saveData);
        if (response?.status === 200) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };

  return (
    <Screen>
      <Header
        title={mode === "edit" ? "수면 목표 수정" : "수면 목표 등록"}
        rightButton={{
          text: "저장",
          onPress: handleSave,
        }}
      />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Container>
          <InstructionBox>
            <InstructionText>
              규칙적인 수면을 위해 목표 시간을 설정해보세요.
            </InstructionText>
          </InstructionBox>

          {/* 수면 목표 활성화 - 수정 모드일 때만 표시 */}
          {mode === "edit" && (
            <Section>
              <SectionTitle>수면 목표 활성</SectionTitle>
              <ActivationButtonsContainer>
                <ActivationButton
                  isSelected={isActive}
                  onPress={() => setIsActive(true)}
                  activeOpacity={1}
                >
                  <ActivationButtonText isSelected={isActive}>
                    켜짐
                  </ActivationButtonText>
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={
                      isActive ? theme.colors.primary : theme.colors.gray500
                    }
                  />
                </ActivationButton>
                <ActivationButton
                  isSelected={!isActive}
                  onPress={() => setIsActive(false)}
                  activeOpacity={1}
                >
                  <ActivationButtonText isSelected={!isActive}>
                    꺼짐
                  </ActivationButtonText>
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={
                      isActive ? theme.colors.primary : theme.colors.gray500
                    }
                  />
                </ActivationButton>
              </ActivationButtonsContainer>
            </Section>
          )}

          {/* 요일 설정 */}
          <Section>
            <SectionTitle>요일 설정</SectionTitle>
            <DaysContainer>
              {DAYS.map((day, index) => (
                <DayButton
                  key={index}
                  isSelected={selectedDays.has(index)}
                  onPress={() => toggleDay(index)}
                  activeOpacity={0.7}
                >
                  <DayButtonText isSelected={selectedDays.has(index)}>
                    {day}
                  </DayButtonText>
                </DayButton>
              ))}
            </DaysContainer>
          </Section>

          {/* 시간 설정 */}
          <Section>
            <SectionTitle>시간 설정</SectionTitle>

            {/* 기상 시간 */}
            <TimeSettingCard>
              <TimeSettingRow>
                <TimeSettingLabel>기상</TimeSettingLabel>
                <TimeDisplay onPress={() => openTimeModal("wake")}>
                  <TimeDisplayText>
                    {formatTime(wakeHour, wakeMinute, wakeAmPm)}
                  </TimeDisplayText>
                </TimeDisplay>
              </TimeSettingRow>
              <SettingRow>
                <SettingLabel>알림</SettingLabel>
                <ToggleSwitch
                  value={wakeAlarmEnabled}
                  onValueChange={setWakeAlarmEnabled}
                  size="small"
                />
              </SettingRow>
              {wakeAlarmEnabled && (
                <SettingRow>
                  <SettingLabel>알림 유형</SettingLabel>
                  <DropdownButton
                    onPress={() => {
                      setCurrentAlarmType("wake");
                      setAlarmTypeModalVisible(true);
                    }}
                  >
                    <DropdownText>{wakeAlarmType}</DropdownText>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.text}
                    />
                  </DropdownButton>
                </SettingRow>
              )}
            </TimeSettingCard>

            {/* 취침 시간 */}
            <TimeSettingCard>
              <TimeSettingRow>
                <TimeSettingLabel>취침</TimeSettingLabel>
                <TimeDisplay onPress={() => openTimeModal("bedtime")}>
                  <TimeDisplayText>
                    {formatTime(bedtimeHour, bedtimeMinute, bedtimeAmPm)}
                  </TimeDisplayText>
                </TimeDisplay>
              </TimeSettingRow>
              <SettingRow>
                <SettingLabel>알림</SettingLabel>
                <ToggleSwitch
                  value={bedtimeAlarmEnabled}
                  onValueChange={setBedtimeAlarmEnabled}
                  size="small"
                />
              </SettingRow>
              {bedtimeAlarmEnabled && (
                <SettingRow>
                  <SettingLabel>알림 유형</SettingLabel>
                  <DropdownButton
                    onPress={() => {
                      setCurrentAlarmType("bedtime");
                      setAlarmTypeModalVisible(true);
                    }}
                  >
                    <DropdownText>{bedtimeAlarmType}</DropdownText>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.text}
                    />
                  </DropdownButton>
                </SettingRow>
              )}
            </TimeSettingCard>
          </Section>

          {/* 수면 시간 목표 요약 */}
          <SummaryContainer>
            <SummaryText>
              수면 시간 목표는{" "}
              <SummaryTimeText
                highlight={sleepHours.hours >= 7 && sleepHours.hours <= 9}
              >
                {sleepHours.hours}시간
                {sleepHours.minutes > 0 && ` ${sleepHours.minutes}분`}
              </SummaryTimeText>{" "}
              입니다.
            </SummaryText>
            {sleepHours.hours >= 7 && sleepHours.hours <= 9 ? (
              <SummarySubText>적절한 수면 시간입니다.</SummarySubText>
            ) : sleepHours.hours < 7 ? (
              <>
                <SummarySubText>건강을 위해 수면이 중요합니다.</SummarySubText>
                <SummarySubText>
                  가능하시다면 7~9시간 수면을 목표로 해보세요.
                </SummarySubText>
              </>
            ) : (
              <SummarySubText>
                수면 시간이 너무 깁니다.\n적절한 수면 시간을 유지해보세요.
              </SummarySubText>
            )}
          </SummaryContainer>
        </Container>
      </ScrollableContent>

      {/* 기상 시간 선택 모달 */}
      <Modal
        visible={wakeTimeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWakeTimeModalVisible(false)}
      >
        <ModalOverlay>
          <OverlayTouchable
            activeOpacity={1}
            onPress={() => setWakeTimeModalVisible(false)}
          />
          <ModalCard
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
          >
            <ModalHeader>
              <ModalTitle>기상 시간</ModalTitle>
              <CloseButton
                onPress={() => setWakeTimeModalVisible(false)}
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>
            <TimePickerContainer>
              <TimePickerWrapper>
                {renderPickerItems(
                  Array.from({ length: 12 }, (_, i) => i + 1),
                  wakeHour,
                  (e) => handleHourScroll(e, setWakeHour, "wake"),
                  (e) => handleHourScrollEnd(e, setWakeHour, wakeHourScrollRef),
                  wakeHourScrollRef
                )}
                <TimeSeparator>:</TimeSeparator>
                {renderPickerItems(
                  Array.from({ length: 60 }, (_, i) => i),
                  wakeMinute,
                  (e) => handleMinuteScroll(e, setWakeMinute),
                  (e) =>
                    handleMinuteScrollEnd(
                      e,
                      setWakeMinute,
                      wakeMinuteScrollRef
                    ),
                  wakeMinuteScrollRef
                )}
                {renderPickerItems(
                  ["AM", "PM"],
                  wakeAmPm,
                  (e) => handleAmPmScroll(e, setWakeAmPm),
                  (e) => handleAmPmScrollEnd(e, setWakeAmPm, wakeAmPmScrollRef),
                  wakeAmPmScrollRef
                )}
              </TimePickerWrapper>
            </TimePickerContainer>
          </ModalCard>
        </ModalOverlay>
      </Modal>

      {/* 취침 시간 선택 모달 */}
      <Modal
        visible={bedtimeTimeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBedtimeTimeModalVisible(false)}
      >
        <ModalOverlay>
          <OverlayTouchable
            activeOpacity={1}
            onPress={() => setBedtimeTimeModalVisible(false)}
          />
          <ModalCard
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
          >
            <ModalHeader>
              <ModalTitle>취침 시간</ModalTitle>
              <CloseButton
                onPress={() => setBedtimeTimeModalVisible(false)}
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>
            <TimePickerContainer>
              <TimePickerWrapper>
                {renderPickerItems(
                  Array.from({ length: 12 }, (_, i) => i + 1),
                  bedtimeHour,
                  (e) => handleHourScroll(e, setBedtimeHour, "bedtime"),
                  (e) =>
                    handleHourScrollEnd(
                      e,
                      setBedtimeHour,
                      bedtimeHourScrollRef
                    ),
                  bedtimeHourScrollRef
                )}
                <TimeSeparator>:</TimeSeparator>
                {renderPickerItems(
                  Array.from({ length: 60 }, (_, i) => i),
                  bedtimeMinute,
                  (e) => handleMinuteScroll(e, setBedtimeMinute),
                  (e) =>
                    handleMinuteScrollEnd(
                      e,
                      setBedtimeMinute,
                      bedtimeMinuteScrollRef
                    ),
                  bedtimeMinuteScrollRef
                )}
                {renderPickerItems(
                  ["AM", "PM"],
                  bedtimeAmPm,
                  (e) => handleAmPmScroll(e, setBedtimeAmPm),
                  (e) =>
                    handleAmPmScrollEnd(
                      e,
                      setBedtimeAmPm,
                      bedtimeAmPmScrollRef
                    ),
                  bedtimeAmPmScrollRef
                )}
              </TimePickerWrapper>
            </TimePickerContainer>
          </ModalCard>
        </ModalOverlay>
      </Modal>

      {/* 알림 유형 선택 모달 */}
      <Modal
        visible={alarmTypeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAlarmTypeModalVisible(false)}
      >
        <ModalOverlay>
          <OverlayTouchable
            activeOpacity={1}
            onPress={() => setAlarmTypeModalVisible(false)}
          />
          <ModalCard
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
          >
            <ModalHeader>
              <ModalTitle>알림 유형</ModalTitle>
              <CloseButton
                onPress={() => setAlarmTypeModalVisible(false)}
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>
            <AlarmTypeModalContent>
              {ALARM_TYPES[
                currentAlarmType === "wake" ? "WAKE" : "BEDTIME"
              ].map((type) => {
                const isSelected =
                  currentAlarmType === "wake"
                    ? wakeAlarmType === type
                    : bedtimeAlarmType === type;
                return (
                  <AlarmTypeOption
                    key={type}
                    isSelected={isSelected}
                    onPress={() => {
                      if (currentAlarmType === "wake") {
                        setWakeAlarmType(type);
                      } else {
                        setBedtimeAlarmType(type);
                      }
                      setAlarmTypeModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <AlarmTypeOptionText isSelected={isSelected}>
                      {type}
                    </AlarmTypeOptionText>
                  </AlarmTypeOption>
                );
              })}
            </AlarmTypeModalContent>
          </ModalCard>
        </ModalOverlay>
      </Modal>
    </Screen>
  );
};

export default SleepGoalFormScreen;
