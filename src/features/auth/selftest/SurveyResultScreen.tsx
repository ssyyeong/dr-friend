import React from "react";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from "react-native";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import { Ionicons } from "@expo/vector-icons";
import { SleepSurveyResultPayload } from "../../../shared/utils/sleepSurveyCalculator";
import ExcellentSvg from "../../../../assets/icon/excellent.svg";
import GoodSvg from "../../../../assets/icon/good.svg";
import CautionSvg from "../../../../assets/icon/caution.svg";
import ProblematicSvg from "../../../../assets/icon/problematic.svg";
import SevereSvg from "../../../../assets/icon/servere.svg";

type Props = NativeStackScreenProps<AuthStackParamList, "SurveyResult">;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled(ScrollView)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  padding: 24px;
  padding-top: 40px;
`;

const HeaderButton = styled.View`
  align-self: center;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding: 8px 16px;
  margin-bottom: 40px;
`;

const HeaderButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ContentContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const IconContainer = styled.View`
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const LevelContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const LevelText = styled.Text<{ color: string }>`
  font-size: 18px;
  font-weight: 500;
  color: ${({ color }) => color};
  text-align: center;
`;

const DescriptionText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 38.4px;
  margin-top: 24px;
  margin-bottom: 48px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: transparent;
`;

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

const getLevelColor = (levelCode: string, theme: any): string => {
  switch (levelCode) {
    case "EXCELLENT":
      return "#25C3FB"; // 초록색 (매우 양호)
    case "GOOD_MINOR":
      return "#63DB63"; // 하늘색 (양호)
    case "CAUTION":
      return "#DECC52"; // 노란색 (주의)
    case "PROBLEMATIC":
      return "#E27745"; // 주황색 (문제성)
    case "SEVERE":
      return "#C93E3E"; // 빨간색 (심각)
    default:
      return "#25C3FB";
  }
};

const SurveyResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const result = route.params?.result as SleepSurveyResultPayload;

  if (!result) {
    return null;
  }

  const handleViewRoutine = () => {
    navigation.navigate("CustomRoutine", { result });
  };

  return (
    <Screen>
      <ScrollableContent
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <HeaderButton>
            <HeaderButtonText>수면 건강 진단 결과</HeaderButtonText>
          </HeaderButton>

          <ContentContainer>
            <IconContainer>
              {React.createElement(getIconSvg(result.LEVEL_CODE), {
                width: 80,
                height: 80,
              })}
            </IconContainer>

            <LevelContainer>
              <LevelText color={getLevelColor(result.LEVEL_CODE, theme)}>
                {result.LEVEL_LABEL_KO} | {result.LEVEL_LABEL_EN}
              </LevelText>
            </LevelContainer>

            <DescriptionText>
              {getResultMessage(result.LEVEL_CODE)}
            </DescriptionText>
          </ContentContainer>
        </Container>
      </ScrollableContent>

      <ButtonContainer>
        <Button variant="primary" onPress={handleViewRoutine}>
          맞춤 수면 루틴 보기
        </Button>
      </ButtonContainer>
    </Screen>
  );
};

export default SurveyResultScreen;
