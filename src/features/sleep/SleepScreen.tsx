import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Platform } from "react-native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import Button from "../../shared/components/common/Button";
import ToggleSwitch from "../../shared/components/common/ToggleSwitch";
import { SleepStackParamList } from "../../app/navigation/RootNavigator";
import SleepMemoModal from "../diary/components/SleepMemoModal";

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

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
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

const SettingCard = styled.View`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  margin-top: 12px;
`;

const SettingHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SettingTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
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

const ITEM_HEIGHT = 50;

type SleepScreenNavigationProp = NativeStackNavigationProp<
  SleepStackParamList,
  "Sleep"
>;

const SleepScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SleepScreenNavigationProp>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [snoringRecordingEnabled, setSnoringRecordingEnabled] = useState(false);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
  const [selectedMemoOptions, setSelectedMemoOptions] = useState<string[]>([]);

  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");

  // ✅ ScrollView 직접 ref (styled.ScrollView는 ref 전달 안 됨)
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const amPmScrollRef = useRef<ScrollView>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 초기 스크롤 위치 설정
  useEffect(() => {
    if (!isInitialized) {
      const hours = alarmTime.getHours();
      const minutes = alarmTime.getMinutes();
      const displayHour = hours % 12 || 12;
      const ampm: "AM" | "PM" = hours >= 12 ? "PM" : "AM";

      setSelectedHour(displayHour);
      setSelectedMinute(minutes);
      setSelectedAmPm(ampm);

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
        setIsInitialized(true);
      }, 200);
    }
  }, []);

  // 피커 값 변경 시 alarmTime 업데이트
  useEffect(() => {
    if (!isInitialized) return;

    const hours24 =
      selectedAmPm === "PM"
        ? selectedHour === 12
          ? 12
          : selectedHour + 12
        : selectedHour === 12
          ? 0
          : selectedHour;

    const newAlarmTime = new Date();
    newAlarmTime.setHours(hours24, selectedMinute, 0, 0);

    if (
      newAlarmTime.getHours() !== alarmTime.getHours() ||
      newAlarmTime.getMinutes() !== alarmTime.getMinutes()
    ) {
      setAlarmTime(newAlarmTime);
      // ✅ 알람 시간 변경 시 자동 예약
      if (alarmEnabled) scheduleAlarm(newAlarmTime);
    }
  }, [selectedHour, selectedMinute, selectedAmPm, isInitialized]);

  // ✅ 알람 예약
  const scheduleAlarm = async (time?: Date) => {
    if (Platform.OS === "web") return;
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const now = new Date();
      const alarm = new Date(time ?? alarmTime);
      if (alarm <= now) alarm.setDate(alarm.getDate() + 1);

      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "알람",
          body: "일어날 시간입니다!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: alarm,
        },
      });
      console.log("알람 설정:", alarm.toLocaleString());
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

  // 알람 토글 변경 시 예약/취소
  const handleAlarmToggle = (value: boolean) => {
    setAlarmEnabled(value);
    if (value) scheduleAlarm();
    else cancelAlarm();
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return {
      time: `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`,
    };
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

  // ✅ 스크롤 핸들러
  const handleHourScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newHour = Math.max(1, Math.min(12, Math.round(y / ITEM_HEIGHT) + 1));
    if (newHour !== selectedHour) setSelectedHour(newHour);
  };

  const handleHourScrollEnd = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newHour = Math.max(1, Math.min(12, Math.round(y / ITEM_HEIGHT) + 1));
    setSelectedHour(newHour);
    const targetY = (newHour - 1) * ITEM_HEIGHT;
    hourScrollRef.current?.scrollTo({ y: targetY, animated: false });
    requestAnimationFrame(() =>
      hourScrollRef.current?.scrollTo({ y: targetY, animated: true }),
    );
  };

  const handleMinuteScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newMinute = Math.max(0, Math.min(59, Math.round(y / ITEM_HEIGHT)));
    if (newMinute !== selectedMinute) setSelectedMinute(newMinute);
  };

  const handleMinuteScrollEnd = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const newMinute = Math.max(0, Math.min(59, Math.round(y / ITEM_HEIGHT)));
    setSelectedMinute(newMinute);
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
    if (newAmPm !== selectedAmPm) setSelectedAmPm(newAmPm);
  };

  const handleAmPmScrollEnd = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y ?? 0;
    const clampedIndex = Math.max(0, Math.min(1, Math.round(y / ITEM_HEIGHT)));
    const newAmPm: "AM" | "PM" = clampedIndex === 0 ? "AM" : "PM";
    setSelectedAmPm(newAmPm);
    const targetY = clampedIndex * ITEM_HEIGHT;
    amPmScrollRef.current?.scrollTo({ y: targetY, animated: false });
    requestAnimationFrame(() =>
      amPmScrollRef.current?.scrollTo({ y: targetY, animated: true }),
    );
  };

  // ✅ PickerScrollView → ScrollView 직접 사용 (ref 전달 문제 해결)
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
        nestedScrollEnabled={true} // ✅ 이거 추가
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

  const currentTimeFormatted = formatTime(currentTime);

  return (
    <Screen>
      <ScrollableContent
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <Content>
          <MoonIconContainer>
            {React.createElement(
              require("../../../assets/icon/moon.svg").default ||
                require("../../../assets/icon/moon.svg"),
              { width: 100, height: 100 },
            )}
          </MoonIconContainer>

          <CurrentTime>{currentTimeFormatted.time}</CurrentTime>
          <CurrentDate>{formatDate(currentTime)}</CurrentDate>

          <SleepButtonContainer>
            <Button
              variant="primary"
              onPress={() => setIsMemoModalVisible(true)}
            >
              취침 시작
            </Button>
          </SleepButtonContainer>

          <SettingCard>
            <SettingHeader>
              <SettingTitle>알림 설정</SettingTitle>
              {/* ✅ 알림 토글 추가 */}
              <ToggleSwitch
                value={alarmEnabled}
                onValueChange={handleAlarmToggle}
                size="small"
              />
            </SettingHeader>
            <TimePickerContainer>
              <TimePickerWrapper>
                {renderPickerItems(
                  ["AM", "PM"],
                  selectedAmPm,
                  handleAmPmScroll,
                  handleAmPmScrollEnd,
                  amPmScrollRef,
                )}
                {renderPickerItems(
                  Array.from({ length: 12 }, (_, i) => i + 1),
                  selectedHour,
                  handleHourScroll,
                  handleHourScrollEnd,
                  hourScrollRef,
                )}
                <TimeSeparator>:</TimeSeparator>
                {renderPickerItems(
                  Array.from({ length: 60 }, (_, i) => i),
                  selectedMinute,
                  handleMinuteScroll,
                  handleMinuteScrollEnd,
                  minuteScrollRef,
                )}
              </TimePickerWrapper>
            </TimePickerContainer>
          </SettingCard>

          <SettingCard>
            <SettingHeader>
              <SettingTitle>코골이 녹음</SettingTitle>
              <ToggleSwitch
                value={snoringRecordingEnabled}
                onValueChange={setSnoringRecordingEnabled}
                size="small"
              />
            </SettingHeader>
          </SettingCard>
        </Content>
      </ScrollableContent>

      <SleepMemoModal
        visible={isMemoModalVisible}
        onClose={() => setIsMemoModalVisible(false)}
        title="취침 전 메모"
        buttonText="다음"
        selectedOptions={selectedMemoOptions}
        onOptionsChange={setSelectedMemoOptions}
        onButtonPress={() => {
          setIsMemoModalVisible(false);
          navigation.navigate("DevicePlace");
        }}
      />
    </Screen>
  );
};

export default SleepScreen;
