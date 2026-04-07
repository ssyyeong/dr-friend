import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import Button from "../../shared/components/common/Button";
import { SleepStackParamList } from "../../app/navigation/RootNavigator";
import MorningBackground from "../../../assets/image/alarm-morning-background.svg";
import NightBackground from "../../../assets/image/alarm-night-background.svg";
import MoonSvg from "../../../assets/icon/moon.svg";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// =====================
// Styled Components
// =====================

const Screen = styled(SafeAreaView)`
  flex: 1;
`;

const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  padding: 48px 24px 24px;
`;

const MoonIconContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const CurrentTime = styled.Text`
  font-size: 32px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 8px;
`;

const CurrentDate = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 40px;
`;

const SleepButtonContainer = styled.View`
  width: 100%;
  margin-bottom: 32px;
`;

const BlockButton = styled.TouchableOpacity`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

const BlockLabel = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const AlarmButton = styled.TouchableOpacity`
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 12px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
`;

const AlarmButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const TimePickerContainer = styled.View`
  align-items: center;
  margin-top: 8px;
  height: 150px;
  position: relative;
`;

const TimePickerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 150px;
`;

const PickerColumn = styled.View`
  height: 150px;
  width: 80px;
  position: relative;
  overflow: hidden;
`;

const PickerItem = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
`;

const PickerItemText = styled.Text<{ selected: boolean }>`
  font-size: ${({ selected }) => (selected ? 32 : 24)}px;
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.text : theme.colors.gray400};
  opacity: ${({ selected }) => (selected ? 1 : 0.5)};
`;

const TimeSeparator = styled.Text`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 8px;
  height: 50px;
  line-height: 50px;
`;

const SelectionIndicator = styled.View`
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  height: 50px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray600};
  pointer-events: none;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: flex-end;
`;

const OverlayTouchable = styled.TouchableOpacity`
  flex: 1;
`;

const ModalCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray800};
  border-top-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
  max-height: 90%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalSubTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

// 다시 알림 바텀시트
const ReAlarmRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
`;

const ReAlarmText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

// 기분 선택 모달
const MoodContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const MoodButton = styled.TouchableOpacity<{ selected: boolean }>`
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.secondary + "33" : "transparent"};
`;

const MoodEmoji = styled.Text`
  font-size: 48px;
  margin-bottom: 8px;
`;

const MoodLabel = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.secondary : theme.colors.textSecondary};
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
`;

const ITEM_HEIGHT = 50;

type SleepScreenNavigationProp = NativeStackNavigationProp<
  SleepStackParamList,
  "Sleep"
>;

const AlarmScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SleepScreenNavigationProp>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [sleepStatus, setSleepStatus] = useState<"sleeping" | "stopped">(
    "sleeping",
  );

  // 모달 상태
  const [isAlarmChangeModalVisible, setIsAlarmChangeModalVisible] =
    useState(false);
  const [isReAlarmModalVisible, setIsReAlarmModalVisible] = useState(false);
  const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<
    "bad" | "normal" | "good" | null
  >(null);

  // ✅ isMorning: 오전 6시 ~ 오후 8시 사이만 아침
  const isMorning = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20;
  }, []);

  const screenDimensions = useRef({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const BackgroundSvgComponent = useMemo(
    () => (isMorning ? MorningBackground : NightBackground),
    [isMorning],
  );

  // 피커 임시 상태
  const [tempHour, setTempHour] = useState(9);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempAmPm, setTempAmPm] = useState<"AM" | "PM">("AM");

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const amPmScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 모달 열릴 때 피커 초기화
  useEffect(() => {
    if (isAlarmChangeModalVisible) {
      const hours = alarmTime.getHours();
      const minutes = alarmTime.getMinutes();
      const displayHour = hours % 12 || 12;
      const ampm: "AM" | "PM" = hours >= 12 ? "PM" : "AM";

      setTempHour(displayHour);
      setTempMinute(minutes);
      setTempAmPm(ampm);

      setTimeout(() => {
        hourScrollRef.current?.scrollTo({
          y: (displayHour - 1) * ITEM_HEIGHT,
          animated: false,
        });
        minuteScrollRef.current?.scrollTo({
          y: minutes * ITEM_HEIGHT,
          animated: false,
        });
        amPmScrollRef.current?.scrollTo({
          y: ampm === "AM" ? 0 : ITEM_HEIGHT,
          animated: false,
        });
      }, 150);
    }
  }, [isAlarmChangeModalVisible]);

  // ✅ 알람 예약
  const scheduleAlarm = async (time: Date) => {
    if (Platform.OS === "web") return;
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const now = new Date();
      const alarm = new Date(time);
      if (alarm <= now) alarm.setDate(alarm.getDate() + 1);

      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "기상 알람",
          body: "일어날 시간입니다! 🌅",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: alarm,
        },
      });
    } catch (error) {
      console.error("알람 설정 오류:", error);
    }
  };

  const cancelAlarm = async () => {
    if (Platform.OS === "web") return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("알람 취소 오류:", error);
    }
  };

  // ✅ 알람 확정
  const handleAlarmConfirm = () => {
    const hours24 =
      tempAmPm === "PM"
        ? tempHour === 12
          ? 12
          : tempHour + 12
        : tempHour === 12
          ? 0
          : tempHour;

    const newAlarm = new Date();
    newAlarm.setHours(hours24, tempMinute, 0, 0);
    setAlarmTime(newAlarm);
    scheduleAlarm(newAlarm);
    setIsAlarmChangeModalVisible(false);
  };

  // ✅ 정지 버튼
  const handleStop = () => {
    if (!isMorning) {
      // 밤: 바로 SleepScreen으로
      cancelAlarm();
      navigation.navigate("Sleep");
    } else {
      // 아침: 정지 후 다시알림 바텀시트
      setSleepStatus("stopped");
      setIsReAlarmModalVisible(true);
    }
  };

  // ✅ 기상 버튼
  const handleWakeUp = () => {
    cancelAlarm();
    setSelectedMood(null);
    setIsMoodModalVisible(true);
  };

  // ✅ 기분 선택 후 SleepScreen으로
  const handleMoodSelect = (mood: "bad" | "normal" | "good") => {
    setSelectedMood(mood);
    setTimeout(() => {
      setIsMoodModalVisible(false);
      navigation.navigate("Sleep");
    }, 300);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
  };

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
    return `${weekdays[date.getDay()]}, ${months[date.getMonth()]}${date.getDate()}일`;
  };

  // 스크롤 핸들러
  const handleHourScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newHour = Math.max(1, Math.min(12, Math.round(y / ITEM_HEIGHT) + 1));
    if (newHour !== tempHour) setTempHour(newHour);
  };

  const handleHourScrollEnd = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newHour = Math.max(1, Math.min(12, Math.round(y / ITEM_HEIGHT) + 1));
    setTempHour(newHour);
    const targetY = (newHour - 1) * ITEM_HEIGHT;
    hourScrollRef.current?.scrollTo({ y: targetY, animated: false });
    requestAnimationFrame(() =>
      hourScrollRef.current?.scrollTo({ y: targetY, animated: true }),
    );
  };

  const handleMinuteScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newMinute = Math.max(0, Math.min(59, Math.round(y / ITEM_HEIGHT)));
    if (newMinute !== tempMinute) setTempMinute(newMinute);
  };

  const handleMinuteScrollEnd = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newMinute = Math.max(0, Math.min(59, Math.round(y / ITEM_HEIGHT)));
    setTempMinute(newMinute);
    const targetY = newMinute * ITEM_HEIGHT;
    minuteScrollRef.current?.scrollTo({ y: targetY, animated: false });
    requestAnimationFrame(() =>
      minuteScrollRef.current?.scrollTo({ y: targetY, animated: true }),
    );
  };

  const handleAmPmScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const clampedIndex = Math.max(0, Math.min(1, Math.round(y / ITEM_HEIGHT)));
    const newAmPm: "AM" | "PM" = clampedIndex === 0 ? "AM" : "PM";
    if (newAmPm !== tempAmPm) setTempAmPm(newAmPm);
  };

  const handleAmPmScrollEnd = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const clampedIndex = Math.max(0, Math.min(1, Math.round(y / ITEM_HEIGHT)));
    const newAmPm: "AM" | "PM" = clampedIndex === 0 ? "AM" : "PM";
    setTempAmPm(newAmPm);
    const targetY = clampedIndex * ITEM_HEIGHT;
    amPmScrollRef.current?.scrollTo({ y: targetY, animated: false });
    requestAnimationFrame(() =>
      amPmScrollRef.current?.scrollTo({ y: targetY, animated: true }),
    );
  };

  const renderPickerItems = (
    items: (string | number)[],
    selectedValue: string | number,
    onScroll: (event: any) => void,
    onScrollEnd: (event: any) => void,
    scrollRef: React.RefObject<ScrollView | null>,
  ) => (
    <PickerColumn>
      <SelectionIndicator />
      <ScrollView
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
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT,
          paddingBottom: ITEM_HEIGHT,
        }}
      >
        {items.map((item, index) => (
          <PickerItem key={index}>
            <PickerItemText selected={item === selectedValue}>
              {item.toString().padStart(2, "0")}
            </PickerItemText>
          </PickerItem>
        ))}
      </ScrollView>
    </PickerColumn>
  );

  return (
    <Screen>
      <BackgroundContainer>
        <BackgroundSvgComponent
          width={screenDimensions.current.width}
          height={screenDimensions.current.height}
          preserveAspectRatio="xMidYMid slice"
        />
      </BackgroundContainer>

      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          <MoonIconContainer>
            <MoonSvg width={100} height={100} />
          </MoonIconContainer>

          <CurrentTime>{formatTime(currentTime)}</CurrentTime>
          <CurrentDate>{formatDate(currentTime)}</CurrentDate>

          <SleepButtonContainer>
            {/* 밤 + 수면중: 정지 + 알림변경 */}
            {!isMorning && sleepStatus === "sleeping" && (
              <>
                <BlockButton activeOpacity={0.8} onPress={handleStop}>
                  <BlockLabel>정지</BlockLabel>
                </BlockButton>
                <AlarmButton
                  activeOpacity={0.8}
                  onPress={() => setIsAlarmChangeModalVisible(true)}
                >
                  <AlarmButtonText>
                    알림 {formatTime(alarmTime)}
                  </AlarmButtonText>
                </AlarmButton>
              </>
            )}

            {/* 아침 + 수면중: 정지 */}
            {isMorning && sleepStatus === "sleeping" && (
              <BlockButton activeOpacity={0.8} onPress={handleStop}>
                <BlockLabel>정지</BlockLabel>
              </BlockButton>
            )}

            {/* 아침 + 정지 후: 기상 */}
            {isMorning && sleepStatus === "stopped" && (
              <BlockButton activeOpacity={0.8} onPress={handleWakeUp}>
                <BlockLabel>기상</BlockLabel>
              </BlockButton>
            )}
          </SleepButtonContainer>
        </Content>
      </ScrollableContent>

      {/* ✅ 알림 변경 모달 */}
      <Modal
        visible={isAlarmChangeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAlarmChangeModalVisible(false)}
      >
        <ModalOverlay>
          <OverlayTouchable
            activeOpacity={1}
            onPress={() => setIsAlarmChangeModalVisible(false)}
          />
          <ModalCard>
            <ModalHeader>
              <ModalTitle>알림 변경</ModalTitle>
              <CloseButton
                onPress={() => setIsAlarmChangeModalVisible(false)}
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>

            <TimePickerContainer>
              <TimePickerWrapper>
                {renderPickerItems(
                  ["AM", "PM"],
                  tempAmPm,
                  handleAmPmScroll,
                  handleAmPmScrollEnd,
                  amPmScrollRef,
                )}
                {renderPickerItems(
                  Array.from({ length: 12 }, (_, i) => i + 1),
                  tempHour,
                  handleHourScroll,
                  handleHourScrollEnd,
                  hourScrollRef,
                )}
                <TimeSeparator>:</TimeSeparator>
                {renderPickerItems(
                  Array.from({ length: 60 }, (_, i) => i),
                  tempMinute,
                  handleMinuteScroll,
                  handleMinuteScrollEnd,
                  minuteScrollRef,
                )}
              </TimePickerWrapper>
            </TimePickerContainer>

            <SleepButtonContainer
              style={{ flexDirection: "row", marginTop: 24 }}
            >
              <Button
                variant="ghost"
                onPress={() => setIsAlarmChangeModalVisible(false)}
                style={{ flex: 1, marginRight: 6 }}
              >
                취소
              </Button>
              <Button
                variant="primary"
                onPress={handleAlarmConfirm}
                style={{ flex: 1, marginLeft: 6 }}
              >
                완료
              </Button>
            </SleepButtonContainer>
          </ModalCard>
        </ModalOverlay>
      </Modal>

      {/* ✅ 다시 알림 바텀시트 */}
      <Modal
        visible={isReAlarmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsReAlarmModalVisible(false)}
      >
        <ModalOverlay>
          <OverlayTouchable
            activeOpacity={1}
            onPress={() => setIsReAlarmModalVisible(false)}
          />
          <ModalCard>
            <ReAlarmRow>
              <ReAlarmText>다시 알림을 설정하시겠습니까?</ReAlarmText>
              <Button
                variant="primary"
                onPress={() => {
                  setIsReAlarmModalVisible(false);
                  setIsAlarmChangeModalVisible(true);
                }}
              >
                다시알림
              </Button>
            </ReAlarmRow>
          </ModalCard>
        </ModalOverlay>
      </Modal>

      {/* ✅ 기분 선택 모달 */}
      <Modal
        visible={isMoodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMoodModalVisible(false)}
      >
        <ModalOverlay>
          <OverlayTouchable
            activeOpacity={1}
            onPress={() => setIsMoodModalVisible(false)}
          />
          <ModalCard>
            <ModalHeader>
              <View>
                <ModalTitle>잘 주무셨습니까?</ModalTitle>
                <ModalSubTitle>기상 기분을 선택하세요.</ModalSubTitle>
              </View>
              <CloseButton
                onPress={() => {
                  setIsMoodModalVisible(false);
                  navigation.navigate("Sleep");
                }}
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>

            <MoodContainer>
              <MoodButton
                selected={selectedMood === "bad"}
                activeOpacity={0.8}
                onPress={() => handleMoodSelect("bad")}
              >
                <MoodEmoji>😡</MoodEmoji>
                <MoodLabel selected={selectedMood === "bad"}>나쁨</MoodLabel>
              </MoodButton>

              <MoodButton
                selected={selectedMood === "normal"}
                activeOpacity={0.8}
                onPress={() => handleMoodSelect("normal")}
              >
                <MoodEmoji>🙂</MoodEmoji>
                <MoodLabel selected={selectedMood === "normal"}>
                  무난함
                </MoodLabel>
              </MoodButton>

              <MoodButton
                selected={selectedMood === "good"}
                activeOpacity={0.8}
                onPress={() => handleMoodSelect("good")}
              >
                <MoodEmoji>😍</MoodEmoji>
                <MoodLabel selected={selectedMood === "good"}>훌륭함</MoodLabel>
              </MoodButton>
            </MoodContainer>
          </ModalCard>
        </ModalOverlay>
      </Modal>
    </Screen>
  );
};

export default AlarmScreen;
