import React, { useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { SafeAreaView } from "../../../shared/components/common/SafeAreaView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, Dimensions } from "react-native";
import {
  AuthStackParamList,
  ProfileStackParamList,
} from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import Header from "../../../shared/components/common/Header";
import FilterTabs from "../../../shared/components/common/FilterTabs";
import RoutineCard from "../../../shared/components/common/RoutineCard";
import { SleepSurveyResultPayload } from "../../../shared/utils/sleepSurveyCalculator";
import ExcellentSvg from "../../../../assets/icon/excellent.svg";
import GoodSvg from "../../../../assets/icon/good.svg";
import CautionSvg from "../../../../assets/icon/caution.svg";
import ProblematicSvg from "../../../../assets/icon/problematic.svg";
import SevereSvg from "../../../../assets/icon/servere.svg";

type Props =
  | NativeStackScreenProps<AuthStackParamList, "CustomRoutine">
  | NativeStackScreenProps<ProfileStackParamList, "CustomRoutine">;

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled(ScrollView)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const NameText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const TitleText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const FilterTabsContainer = styled.View`
  margin-bottom: 24px;
`;

const RoutineCardsContainer = styled.View`
  margin-bottom: 32px;
`;

const RoutineCardsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

const EmptyCard = styled.View`
  width: ${() => (Dimensions.get("window").width - 44) / 2}px;
`;

const DiagnosisSection = styled.View`
  margin-bottom: 24px;
`;

const DiagnosisTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const DiagnosisResultContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
`;

const DiagnosisResultHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const DiagnosisIcon = styled.View`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const DiagnosisLevelText = styled.Text<{ color: string }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ color }) => color};
`;

const DiagnosisMessage = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  line-height: 20px;
`;

const ButtonContainer = styled.View`
  padding: 16px;
  background-color: transparent;
`;

type RoutineCategory = "환경 관리" | "생활습관" | "건강&마음";

interface RoutineCardData {
  id: string;
  imagePath: string;
  backgroundColor: string;
  category: RoutineCategory;
}

const getLevelColor = (levelCode: string): string => {
  switch (levelCode) {
    case "EXCELLENT":
      return "#25C3FB";
    case "GOOD_MINOR":
      return "#63DB63";
    case "CAUTION":
      return "#DECC52";
    case "PROBLEMATIC":
      return "#E27745";
    case "SEVERE":
      return "#C93E3E";
    default:
      return "#25C3FB";
  }
};

const getIconSvg = (levelCode: string): React.FC<any> => {
  switch (levelCode) {
    case "EXCELLENT":
      return ExcellentSvg;
    case "GOOD_MINOR":
      return GoodSvg;
    case "CAUTION":
      return CautionSvg;
    case "PROBLEMATIC":
      return ProblematicSvg;
    case "SEVERE":
      return SevereSvg;
    default:
      return ExcellentSvg;
  }
};

const getResultMessage = (levelCode: string): string => {
  switch (levelCode) {
    case "EXCELLENT":
      return "수면 상태가 매우 좋습니다. 지금의 수면 습관을 계속 유지해보세요.";
    case "GOOD_MINOR":
      return "조금만 관리하면 더 좋아질 수 있습니다. 잠들기 전 생활 습관과 늦은 커피, 휴대폰 사용을 함께 살펴보세요.";
    case "CAUTION":
      return "수면 중 깨는 일, 낮 시간의 졸림, 스트레스 가운데 불편한 부분이 보입니다. 2~4주 정도 생활 습관을 조절해보시고, 불편이 계속되면 상담을 받아보세요.";
    case "PROBLEMATIC":
      return "수면 문제가 일상생활에 영향을 주고 있을 수 있습니다. 수면 습관을 점검해보시고, 필요하면 수면클리닉이나 정신건강의학과, 내과 상담을 받아보시는 것이 좋습니다.";
    case "SEVERE":
      return "수면 상태를 더 자세히 확인해볼 필요가 있습니다. 건강과 안전을 위해 전문가의 진료를 먼저 받아보시는 것을 권합니다.";
    default:
      return "";
  }
};

const CustomRoutineScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] =
    useState<RoutineCategory>("환경 관리");
  const result = route.params?.result as SleepSurveyResultPayload;

  // 임시 루틴 데이터 - 실제로는 API에서 가져와야 함
  const routines: RoutineCardData[] = [
    {
      id: "1",
      imagePath: "assets/image/routine.svg",
      backgroundColor: "#1E3A5F",
      category: "생활습관",
    },
    {
      id: "2",
      imagePath: "assets/image/routine2.svg",
      backgroundColor: "#1E4A3F",
      category: "환경 관리",
    },
    {
      id: "3",
      imagePath: "assets/image/routine3.svg",
      backgroundColor: "#3A2E4F",
      category: "건강&마음",
    },
    {
      id: "4",
      imagePath: "assets/image/routine4.svg",
      backgroundColor: "#2E4A5F",
      category: "생활습관",
    },
  ];

  const filteredRoutines = routines.filter(
    (routine) => routine.category === selectedCategory,
  );

  // 두 개씩 묶어서 행으로 만들기
  const routineRows: RoutineCardData[][] = [];
  for (let i = 0; i < filteredRoutines.length; i += 2) {
    routineRows.push(filteredRoutines.slice(i, i + 2));
  }

  const handleStartRecord = () => {
    (navigation as any)
      .getParent()
      ?.getParent()
      ?.reset({
        index: 0,
        routes: [{ name: "MainTab" }],
      });
  };

  return (
    <Screen>
      <Header title="" showBackButton={true} />
      <ScrollableContent
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <TitleContainer>
            <NameText>사용자</NameText>
            <TitleText>님의 맞춤 수면 루틴</TitleText>
          </TitleContainer>

          <FilterTabsContainer>
            <FilterTabs
              tabs={["환경 관리", "생활습관", "건강&마음"]}
              selectedTab={selectedCategory}
              onTabChange={(tab) => setSelectedCategory(tab as RoutineCategory)}
              size="small"
            />
          </FilterTabsContainer>

          <RoutineCardsContainer>
            {routineRows.map((row, rowIndex) => (
              <RoutineCardsRow key={rowIndex}>
                {row.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    id={routine.id}
                    imagePath={routine.imagePath}
                    backgroundColor={routine.backgroundColor}
                  />
                ))}
                {row.length === 1 && <EmptyCard />}
              </RoutineCardsRow>
            ))}
          </RoutineCardsContainer>

          {result && (
            <DiagnosisSection>
              <DiagnosisTitle>자가 진단 결과</DiagnosisTitle>
              <DiagnosisResultContainer>
                <DiagnosisResultHeader>
                  <DiagnosisIcon>
                    {React.createElement(getIconSvg(result.LEVEL_CODE), {
                      width: 20,
                      height: 20,
                    })}
                  </DiagnosisIcon>
                  <DiagnosisLevelText color={getLevelColor(result.LEVEL_CODE)}>
                    {result.LEVEL_LABEL_KO} | {result.LEVEL_LABEL_EN}
                  </DiagnosisLevelText>
                </DiagnosisResultHeader>
                <DiagnosisMessage>
                  {getResultMessage(result.LEVEL_CODE)}
                </DiagnosisMessage>
              </DiagnosisResultContainer>
            </DiagnosisSection>
          )}
        </Container>
        <ButtonContainer>
          <Button variant="gradient" onPress={handleStartRecord}>
            수면 기록 시작
          </Button>
        </ButtonContainer>
      </ScrollableContent>
    </Screen>
  );
};

export default CustomRoutineScreen;
