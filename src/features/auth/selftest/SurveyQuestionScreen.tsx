import React, { useState } from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "../../../shared/components/common/SafeAreaView";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import { Ionicons } from "@expo/vector-icons";
import { PSHI_SURVEY } from "../../../shared/data/survey";
import { calcSleepSurveyResult } from "../../../shared/utils/sleepSurveyCalculator";
import Controller from "../../../services/controller";

type Props = NativeStackScreenProps<AuthStackParamList, "SurveyQuestion">;

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 32px;
`;

const ProgressBarContainer = styled.View`
  flex: 1;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: 2px;
  overflow: hidden;
  margin-right: 12px;
`;

const ProgressBar = styled.View<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
`;

const ProgressText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  min-width: 40px;
`;

const QuestionContainer = styled.View`
  margin-top: 36px;
  margin-bottom: 20px;
`;

const QuestionText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 35.2px;
`;

// ✅ 만성질환 설명 박스
const InfoBox = styled.View`
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  margin-bottom: 20px;
`;

const InfoBoxTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const InfoBoxContent = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 22px;
`;

const ChoicesContainer = styled.View`
  width: 100%;
  margin-bottom: 24px;
`;

const ChoiceButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? "rgba(115, 83, 255, 0.20)" : theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-width: ${({ isSelected }) => (isSelected ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const ChoiceText = styled.Text<{ isSelected: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.gray0 : theme.colors.text};
  flex: 1;
`;

const CheckIcon = styled(Ionicons)`
  margin-left: 12px;
`;

const NextButtonContainer = styled.View`
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: transparent;
`;

// =====================
// 만성질환 설명 데이터
// =====================

const CHRONIC_DISEASE_INFO = {
  title: "만성질환 종류",
  content:
    "고혈압, 당뇨병, 고지혈증, 심장질환, 뇌혈관질환, 만성폐질환, 천식, 수면무호흡증, 위·소화기 질환(역류성 식도염 등), 관절염, 만성통증질환, 신장질환, 간질환, 갑상선질환, 우울·불안장애, 치매",
};

// 설명 박스를 보여줄 questionNo 목록
const QUESTIONS_WITH_INFO_BOX = [29];

// =====================
// Component
// =====================

const SurveyQuestionScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestion = PSHI_SURVEY.questions[currentQuestionIndex];
  const selectedChoice = answers[currentQuestion.questionNo];
  const progress =
    ((currentQuestionIndex + 1) / PSHI_SURVEY.totalQuestions) * 100;
  const isLastQuestion =
    currentQuestionIndex === PSHI_SURVEY.questions.length - 1;

  // ✅ 현재 질문에 설명 박스가 필요한지 여부
  const showInfoBox = QUESTIONS_WITH_INFO_BOX.includes(
    currentQuestion.questionNo,
  );

  const handleChoiceSelect = (choiceNo: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionNo]: choiceNo,
    }));
  };

  const handleNext = async () => {
    if (!selectedChoice) return;

    if (currentQuestionIndex < PSHI_SURVEY.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const result = calcSleepSurveyResult(answers);
      const controller = new Controller({
        modelName: "SleepSurveyResponseResult",
        modelId: "sleep_survey_response_result",
      });
      const response = await controller.create({
        APP_MEMBER_IDENTIFICATION_CODE: route?.params?.id,
        SURVEY_CODE: PSHI_SURVEY.surveyCode,
        SURVEY_VERSION: PSHI_SURVEY.version,

        TOTAL_SHT: result.TOTAL_SHT,
        LEVEL_CODE: result.LEVEL_CODE,
        LEVEL_LABEL_KO: result.LEVEL_LABEL_KO,
        LEVEL_LABEL_EN: result.LEVEL_LABEL_EN,

        SUB_SLEEP_QUALITY: result.SUB_SLEEP_QUALITY,
        SUB_DAYTIME_SLEEPINESS: result.SUB_DAYTIME_SLEEPINESS,
        SUB_INSOMNIA: result.SUB_INSOMNIA,
        SUB_STRESS: result.SUB_STRESS,

        FLAGS_JSON: result.FLAGS_JSON,

        CHRONIC_COUNT_CHOICE_NO: result.CHRONIC_COUNT_CHOICE_NO,
        CHRONIC_MANAGE_CHOICE_NO: result.CHRONIC_MANAGE_CHOICE_NO,

        RESULT_TEXT_KEY: result.RESULT_TEXT_KEY,
      });

      navigation.navigate("SurveyResult", { result });
    }
  };

  return (
    <Screen>
      <Container>
        <ProgressContainer>
          <ProgressBarContainer>
            <ProgressBar width={progress} />
          </ProgressBarContainer>
          <ProgressText>
            {currentQuestionIndex + 1}/{PSHI_SURVEY.totalQuestions}
          </ProgressText>
        </ProgressContainer>

        <QuestionContainer>
          <QuestionText>{currentQuestion.text}</QuestionText>
        </QuestionContainer>

        {/* ✅ 만성질환 설명 박스 */}
        {showInfoBox && (
          <InfoBox>
            <InfoBoxTitle>{CHRONIC_DISEASE_INFO.title}</InfoBoxTitle>
            <InfoBoxContent>{CHRONIC_DISEASE_INFO.content}</InfoBoxContent>
          </InfoBox>
        )}

        <ChoicesContainer>
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoice === choice.choiceNo;
            return (
              <ChoiceButton
                key={choice.choiceNo}
                isSelected={isSelected}
                onPress={() => handleChoiceSelect(choice.choiceNo)}
                activeOpacity={0.7}
              >
                <ChoiceText isSelected={isSelected}>{choice.label}</ChoiceText>
                <CheckIcon
                  name="checkmark"
                  size={20}
                  color={isSelected ? theme.colors.gray0 : "transparent"}
                />
              </ChoiceButton>
            );
          })}
        </ChoicesContainer>

        <NextButtonContainer>
          <Button
            variant="primary"
            onPress={handleNext}
            disabled={!selectedChoice}
            style={{ opacity: selectedChoice ? 1 : 0.5 }}
          >
            {isLastQuestion ? "완료" : "다음"}
          </Button>
        </NextButtonContainer>
      </Container>
    </Screen>
  );
};

export default SurveyQuestionScreen;
