import React, { useState } from "react";
import styled, { useTheme } from "styled-components/native";
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
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: transparent;
`;

type RoutineCategory = "환경관리" | "생활습관" | "건강&마음";

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
      return "탄탄한 수면 건강. 현재 습관을 유지하세요.";
    case "GOOD_MINOR":
      return "가벼운 개선 포인트 존재. 취침 전 루틴·카페인/스크린 관리로 충분히 개선 가능.";
    case "CAUTION":
      return "수면 중단·졸림·스트레스 중 1–2축에 부담. 2–4주 행동교정(아래 권장안) + 필요 시 1차 상담 권고.";
    case "PROBLEMATIC":
      return "삶의 질에 영향. 수면위생 교정 + 수면 전문의/정신건강의학과/내과 상담을 권합니다.";
    case "SEVERE":
      return "안전·건강 위험. 전문가 평가를 우선 권고(수면무호흡·불면·과다졸림 감별 필요).";
    default:
      return "";
  }
};

const CustomRoutineScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] =
    useState<RoutineCategory>("환경관리");
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
      category: "환경관리",
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
    (routine) => routine.category === selectedCategory
  );

  // 두 개씩 묶어서 행으로 만들기
  const routineRows: RoutineCardData[][] = [];
  for (let i = 0; i < filteredRoutines.length; i += 2) {
    routineRows.push(filteredRoutines.slice(i, i + 2));
  }

  const handleStartRecord = () => {
    // TODO: 수면 기록 화면으로 이동
    (navigation as any).getParent()?.navigate("MainTab");
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
              tabs={["환경관리", "생활습관", "건강&마음"]}
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
      </ScrollableContent>

      <ButtonContainer>
        <Button variant="gradient" onPress={handleStartRecord}>
          수면 기록 시작
        </Button>
      </ButtonContainer>
    </Screen>
  );
};

export default CustomRoutineScreen;
