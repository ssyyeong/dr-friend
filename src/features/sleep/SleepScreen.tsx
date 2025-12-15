import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Dimensions, Platform } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import Button from "../../shared/components/common/Button";
import ToggleSwitch from "../../shared/components/common/ToggleSwitch";
import SvgIcon from "../../shared/components/common/SvgIcon";
import { SleepStackParamList } from "../../app/navigation/RootNavigator";
import SleepMemoModal from "../diary/components/SleepMemoModal";

// 웹 환경이 아닐 때만 알림 핸들러 설정
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

const Screen = styled.SafeAreaView`
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

const PickerScrollView = styled.ScrollView.attrs(() => ({}))`
  flex: 1;
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
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [snoringRecordingEnabled, setSnoringRecordingEnabled] = useState(false);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
  const [selectedMemoOptions, setSelectedMemoOptions] = useState<string[]>([]);

  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(41);
  const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const amPmScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const hours = alarmTime.getHours();
      const minutes = alarmTime.getMinutes();
      const displayHour = hours % 12 || 12;
      const ampm = hours >= 12 ? "PM" : "AM";

      setSelectedHour(displayHour);
      setSelectedMinute(minutes);
      setSelectedAmPm(ampm);

      // 초기 스크롤 위치 설정
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

  useEffect(() => {
    if (!isInitialized) return;

    // 선택된 시간/분/AMPM이 변경되면 alarmTime 업데이트
    const hours24 =
      selectedAmPm === "PM"
        ? selectedHour === 12
          ? 12
          : selectedHour + 12
        : selectedHour === 12
        ? 0
        : selectedHour;

    const newAlarmTime = new Date();
    newAlarmTime.setHours(hours24);
    newAlarmTime.setMinutes(selectedMinute);
    newAlarmTime.setSeconds(0);
    newAlarmTime.setMilliseconds(0);

    // 값이 실제로 변경된 경우에만 업데이트
    if (
      newAlarmTime.getHours() !== alarmTime.getHours() ||
      newAlarmTime.getMinutes() !== alarmTime.getMinutes()
    ) {
      setAlarmTime(newAlarmTime);
    }
  }, [selectedHour, selectedMinute, selectedAmPm, isInitialized]);

  useEffect(() => {
    if (alarmEnabled) {
      scheduleAlarm();
    } else {
      cancelAlarm();
    }
  }, [alarmEnabled, alarmTime]);

  const scheduleAlarm = async () => {
    // 웹 환경에서는 알림 기능을 사용할 수 없음
    if (Platform.OS === "web") {
      console.log("웹 환경에서는 알림 기능을 사용할 수 없습니다.");
      return;
    }

    try {
      await Notifications.requestPermissionsAsync();

      const now = new Date();
      const alarm = new Date(alarmTime);

      // 오늘 알람 시간이 지났으면 내일로 설정
      if (alarm <= now) {
        alarm.setDate(alarm.getDate() + 1);
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "알람",
          body: "일어날 시간입니다!",
          sound: true,
        },
        trigger: alarm as any,
      });
    } catch (error) {
      console.error("알람 설정 오류:", error);
    }
  };

  const cancelAlarm = async () => {
    // 웹 환경에서는 알림 기능을 사용할 수 없음
    if (Platform.OS === "web") {
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("알람 취소 오류:", error);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return {
      time: `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`,
      hours: displayHours,
      minutes: minutes,
      ampm: ampm === "오전" ? "AM" : "PM",
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

    const weekday = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${weekday}, ${month}${day}일`;
  };

  const handleHourScroll = (event: any) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newHour = Math.max(1, Math.min(12, index + 1));
    if (newHour !== selectedHour) {
      setSelectedHour(newHour);
    }
  };

  const handleHourScrollEnd = (event: any) => {
    if (!event?.nativeEvent?.contentOffset) return;

    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newHour = Math.max(1, Math.min(12, index + 1));
    const targetY = (newHour - 1) * ITEM_HEIGHT;

    setSelectedHour(newHour);

    // 즉시 정확한 위치로 스냅 (애니메이션 없이 먼저)
    hourScrollRef.current?.scrollTo({
      y: targetY,
      animated: false,
    });

    // 다음 프레임에서 부드럽게 재스냅
    requestAnimationFrame(() => {
      hourScrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

  const handleMinuteScroll = (event: any) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newMinute = Math.max(0, Math.min(59, index));
    if (newMinute !== selectedMinute) {
      setSelectedMinute(newMinute);
    }
  };

  const handleMinuteScrollEnd = (event: any) => {
    if (!event?.nativeEvent?.contentOffset) return;

    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const newMinute = Math.max(0, Math.min(59, index));
    const targetY = newMinute * ITEM_HEIGHT;

    setSelectedMinute(newMinute);

    // 즉시 정확한 위치로 스냅 (애니메이션 없이 먼저)
    minuteScrollRef.current?.scrollTo({
      y: targetY,
      animated: false,
    });

    // 다음 프레임에서 부드럽게 재스냅
    requestAnimationFrame(() => {
      minuteScrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

  const handleAmPmScroll = (event: any) => {
    if (!event?.nativeEvent?.contentOffset) return;
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(1, index));
    const newAmPm = clampedIndex === 0 ? "AM" : "PM";
    if (newAmPm !== selectedAmPm) {
      setSelectedAmPm(newAmPm);
    }
  };

  const handleAmPmScrollEnd = (event: any) => {
    if (!event?.nativeEvent?.contentOffset) return;

    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(1, index));
    const newAmPm = clampedIndex === 0 ? "AM" : "PM";
    const targetY = clampedIndex * ITEM_HEIGHT;

    setSelectedAmPm(newAmPm);

    // 즉시 정확한 위치로 스냅 (애니메이션 없이 먼저)
    amPmScrollRef.current?.scrollTo({
      y: targetY,
      animated: false,
    });

    // 다음 프레임에서 부드럽게 재스냅
    requestAnimationFrame(() => {
      amPmScrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    });
  };

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
          pagingEnabled={false}
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
        </PickerScrollView>
      </PickerColumn>
    );
  };

  const currentTimeFormatted = formatTime(currentTime);
  const currentDateFormatted = formatDate(currentTime);
  const alarmTimeFormatted = formatTime(alarmTime);

  return (
    <Screen>
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          <MoonIconContainer>
            {React.createElement(
              require("../../../assets/icon/moon.svg").default ||
                require("../../../assets/icon/moon.svg"),
              { width: 100, height: 100 }
            )}
          </MoonIconContainer>

          <CurrentTime>{currentTimeFormatted.time}</CurrentTime>
          <CurrentDate>{currentDateFormatted}</CurrentDate>

          <SleepButtonContainer>
            <Button
              variant="primary"
              onPress={() => setIsMemoModalVisible(true)}
            >
              지금 취침
            </Button>
          </SleepButtonContainer>

          <SettingCard>
            <SettingHeader>
              <SettingTitle>알림 설정</SettingTitle>
              <ToggleSwitch
                value={alarmEnabled}
                onValueChange={setAlarmEnabled}
                size="small"
              />
            </SettingHeader>
            {alarmEnabled && (
              <TimePickerContainer>
                <TimePickerWrapper>
                  {renderPickerItems(
                    Array.from({ length: 12 }, (_, i) => i + 1),
                    selectedHour,
                    handleHourScroll,
                    handleHourScrollEnd,
                    hourScrollRef
                  )}
                  <TimeSeparator>:</TimeSeparator>
                  {renderPickerItems(
                    Array.from({ length: 60 }, (_, i) => i),
                    selectedMinute,
                    handleMinuteScroll,
                    handleMinuteScrollEnd,
                    minuteScrollRef
                  )}
                  {renderPickerItems(
                    ["AM", "PM"],
                    selectedAmPm,
                    handleAmPmScroll,
                    handleAmPmScrollEnd,
                    amPmScrollRef
                  )}
                </TimePickerWrapper>
              </TimePickerContainer>
            )}
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

      {/* 취침 전 메모 모달 */}
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
