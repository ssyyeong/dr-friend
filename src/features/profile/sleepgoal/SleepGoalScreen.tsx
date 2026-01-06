import React, { useState, useCallback } from "react";
import { ScrollView } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import Header from "../../../shared/components/common/Header";
import Button from "../../../shared/components/common/Button";
import { getMemberId } from "../../../services/authService";
import Controller from "../../../services/controller";

type Props = NativeStackScreenProps<ProfileStackParamList, "SleepGoal">;

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

const GoalCard = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  margin-bottom: 16px;
`;

const GoalItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const GoalItemLabel = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.text : theme.colors.gray500};
`;

const GoalItemValue = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.gray200 : theme.colors.gray500};
`;

const EditButton = styled.TouchableOpacity`
  height: 48px;
  background-color: ${({ theme }) => theme.colors.gray600};
  border-radius: ${({ theme }) => theme.radius.md}px;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const EditButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const AddButtonContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
  text-align: center;
`;

// 24시간 형식을 AM/PM 형식으로 변환
const convert24To12 = (hour24: number): { hour: number; ampm: "AM" | "PM" } => {
  if (hour24 === 0) return { hour: 12, ampm: "AM" };
  if (hour24 < 12) return { hour: hour24, ampm: "AM" };
  if (hour24 === 12) return { hour: 12, ampm: "PM" };
  return { hour: hour24 - 12, ampm: "PM" };
};

// 시간 포맷팅
const formatTime = (hour24: number, minute: number): string => {
  const { hour, ampm } = convert24To12(hour24);
  const ampmText = ampm === "AM" ? "오전" : "오후";
  return `${ampmText} ${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

// 수면 시간 계산
const calculateSleepHours = (
  wakeupHour: number,
  wakeupMinute: number,
  bedtimeHour: number,
  bedtimeMinute: number
): number => {
  let wakeupMinutes = wakeupHour * 60 + wakeupMinute;
  let bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute;

  // 취침 시간이 기상 시간보다 늦으면 다음날로 계산
  if (bedtimeMinutes > wakeupMinutes) {
    bedtimeMinutes += 24 * 60;
  }

  const diffMinutes = wakeupMinutes - bedtimeMinutes;
  return Math.floor(diffMinutes / 60);
};

interface SleepGoalData {
  SLEEP_GOAL_IDENTIFICATION_CODE: number;
  IS_ACTIVE: string;
  ACTIVE_DAYS: string[];
  SLEEP_GOAL_HOURS: number;
  WAKEUP_HOUR: number;
  WAKEUP_MINUTE: number;
  WAKEUP_ALARM_ENABLED: string;
  WAKEUP_ALARM_TYPE: string;
  BEDTIME_HOUR: number;
  BEDTIME_MINUTE: number;
  BEDTIME_ALARM_ENABLED: string;
  BEDTIME_ALARM_TYPE: string;
}

const SleepGoalScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [sleepGoals, setSleepGoals] = useState<SleepGoalData[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  const fetchSleepGoals = useCallback(async () => {
    try {
      setLoading(true);
      const memberId = await getMemberId();
      if (!memberId) {
        setLoading(false);
        return;
      }

      const controller = new Controller({
        modelName: "SleepGoal",
        modelId: "sleep_goal",
      });

      const response = await controller.findAll({
        APP_MEMBER_IDENTIFICATION_CODE: memberId,
      });
      if (response?.status === 200 && response?.result?.rows) {
        // ACTIVE_DAYS가 JSON 문자열인 경우 파싱
        const processedRows = response.result.rows.map((row: any) => {
          if (row.ACTIVE_DAYS && typeof row.ACTIVE_DAYS === "string") {
            try {
              row.ACTIVE_DAYS = JSON.parse(row.ACTIVE_DAYS);
            } catch (e) {
              console.error("Failed to parse ACTIVE_DAYS:", e);
              row.ACTIVE_DAYS = [];
            }
          }
          return row;
        });
        setSleepGoals(processedRows);
      } else {
        setSleepGoals([]);
      }
    } catch (error) {
      console.error("수면 목표 데이터 불러오기 실패:", error);
      setSleepGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSleepGoals();
    }, [fetchSleepGoals])
  );

  const handleEdit = (sleepGoal: SleepGoalData) => {
    navigation.navigate("SleepGoalForm", {
      mode: "edit",
      sleepGoal: sleepGoal,
    });
  };

  const handleAdd = () => {
    navigation.navigate("SleepGoalForm", {
      mode: "create",
    });
  };

  return (
    <Screen>
      <Header title="수면 목표" />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Container>
          <InstructionBox>
            <InstructionText>
              규칙적인 수면을 위해 목표 시간을 설정해보세요.
            </InstructionText>
          </InstructionBox>

          {loading ? (
            <EmptyState>
              <EmptyStateText>로딩 중...</EmptyStateText>
            </EmptyState>
          ) : sleepGoals.length === 0 ? (
            <EmptyState>
              <EmptyStateText>등록된 수면 목표가 없습니다.</EmptyStateText>
            </EmptyState>
          ) : (
            sleepGoals.map((goal) => {
              const isActive = goal.IS_ACTIVE === "Y";
              return (
                <GoalCard key={goal.SLEEP_GOAL_IDENTIFICATION_CODE}>
                  <GoalItem>
                    <GoalItemLabel isActive={isActive}>활성 요일</GoalItemLabel>
                    <GoalItemValue isActive={isActive}>
                      {Array.isArray(goal.ACTIVE_DAYS) &&
                      goal.ACTIVE_DAYS.length > 0
                        ? goal.ACTIVE_DAYS.join(", ")
                        : "-"}
                    </GoalItemValue>
                  </GoalItem>
                  <GoalItem>
                    <GoalItemLabel isActive={isActive}>수면 목표</GoalItemLabel>
                    <GoalItemValue isActive={isActive}>
                      {goal.SLEEP_GOAL_HOURS}시간
                    </GoalItemValue>
                  </GoalItem>
                  <GoalItem>
                    <GoalItemLabel isActive={isActive}>취침 알림</GoalItemLabel>
                    <GoalItemValue isActive={isActive}>
                      {formatTime(goal.BEDTIME_HOUR, goal.BEDTIME_MINUTE)}
                    </GoalItemValue>
                  </GoalItem>
                  <GoalItem>
                    <GoalItemLabel isActive={isActive}>기상 알림</GoalItemLabel>
                    <GoalItemValue isActive={isActive}>
                      {formatTime(goal.WAKEUP_HOUR, goal.WAKEUP_MINUTE)}
                    </GoalItemValue>
                  </GoalItem>
                  <EditButton onPress={() => handleEdit(goal)}>
                    <EditButtonText>편집</EditButtonText>
                  </EditButton>
                </GoalCard>
              );
            })
          )}
        </Container>
      </ScrollableContent>

      <AddButtonContainer>
        <Button variant="primary" onPress={handleAdd}>
          수면 목표 추가
        </Button>
      </AddButtonContainer>
    </Screen>
  );
};

export default SleepGoalScreen;
