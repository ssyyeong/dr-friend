import React, { useState, useMemo } from "react";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, Dimensions } from "react-native";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import Header from "../../../shared/components/common/Header";
import FilterTabs from "../../../shared/components/common/FilterTabs";
import RoutineCard from "../../../shared/components/common/RoutineCard";
import StatusLabel from "../../../shared/components/common/StatusLabel";
import { SleepSurveyResultPayload } from "../../../shared/utils/sleepSurveyCalculator";

import { getMemberId } from "../../../services/authService";
import Controller from "../../../services/controller";

import ExcellentSvg from "../../../../assets/icon/excellent.svg";
import ExcellentColorSvg from "../../../../assets/icon/excellent-color.svg";
import GoodSvg from "../../../../assets/icon/good.svg";
import GoodColorSvg from "../../../../assets/icon/good-color.svg";
import CautionSvg from "../../../../assets/icon/caution.svg";
import CautionColorSvg from "../../../../assets/icon/caution-color.svg";
import ProblematicSvg from "../../../../assets/icon/problematic.svg";
import ProblematicColorSvg from "../../../../assets/icon/problematic-color.svg";
import SevereSvg from "../../../../assets/icon/servere.svg";
import SevereColorSvg from "../../../../assets/icon/servere-color.svg";
import InformationCircleRedSvg from "../../../../assets/icon/information-circle-red.svg";

type Props = NativeStackScreenProps<
  ProfileStackParamList,
  "SurveyResultProfile"
>;

type RoutineCategory = "환경관리" | "생활습관" | "건강&마음";

interface RoutineCardData {
  id: string;
  imagePath: string;
  backgroundColor: string;
  category: RoutineCategory;
}

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

const DateBadge = styled.View`
  align-self: center;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding: 8px 16px;
  margin-bottom: 24px;
`;

const DateBadgeText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DiagnosisSection = styled.View`
  margin-bottom: 48px;
`;

const DiagnosisStatusContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
`;

const DiagnosisIcon = styled.View`
  width: 32px;
  height: 32px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const DiagnosisStatusText = styled.Text<{ color: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

const DiagnosisDescription = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 38.4px;
  text-align: center;
`;

const SpecialRecommendationsSection = styled.View`
  margin-bottom: 32px;
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitleText = styled.Text`
  margin-left: 12px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const RecommendationCard = styled.View`
  background-color: rgba(230, 68, 95, 0.16);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  margin-bottom: 12px;
`;

const RecommendationTitle = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const RecommendationText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.warning};
  line-height: 25.6px;
`;

const RoutineSection = styled.View``;

const RoutineTitleContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const RoutineNameText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const RoutineTitleText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const RoutineCardsContainer = styled.View``;

const RoutineCardsRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const EmptyCard = styled.View`
  width: ${() => (Dimensions.get("window").width - 44) / 2}px;
`;

const Divider = styled.View`
  height: 1px;
  margin: 20px 0px 40px 0px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const SelfDiagnosisTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
`;

const SelfDiagnosisItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const SelfDiagnosisTextContainer = styled.View`
  padding: 20px;
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const SelfDiagnosisItemText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 24px;
`;

const getIconSvg = (levelCode: string, color: boolean): React.FC<any> => {
  switch (levelCode) {
    case "EXCELLENT":
      return color ? ExcellentColorSvg : ExcellentSvg;
    case "GOOD_MINOR":
      return color ? GoodColorSvg : GoodSvg;
    case "CAUTION":
      return color ? CautionColorSvg : CautionSvg;
    case "PROBLEMATIC":
      return color ? ProblematicColorSvg : ProblematicSvg;
    case "SEVERE":
      return color ? SevereColorSvg : SevereSvg;
    default:
      return color ? ExcellentColorSvg : ExcellentSvg;
  }
};

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
      return "#63DB63";
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const getRecommendationText = (
  flag: { type: string; questionNo: number; choiceNo: number },
  chronicCount?: number,
  chronicManage?: number
): { title: string; text: string } => {
  switch (flag.type) {
    case "OSA_RISK":
      return {
        title: "문항 12: 코골이/무호흡 의심",
        text: "수면다원검사(PSG) 검토 권고. 체중·알코올·코/인후두·턱 구조 평가 및 필요시 전문의 상담.",
      };
    case "RLS_RISK":
      return {
        title: `문항 ${flag.questionNo}: 하지불안증후군 의심`,
        text: "전문의 상담 권고. 철분 결핍 등 원인 검사 필요.",
      };
    case "SLEEP_MED_RISK":
      return {
        title: `문항 ${flag.questionNo}: 수면약물 의존 위험`,
        text: "의료진과 점진적 감량 계획 수립 권고.",
      };
    case "DAYTIME_SLEEPY_RISK":
      return {
        title: `문항 ${flag.questionNo}: 주간 과다졸림`,
        text: "수면무호흡·기면증 등 감별 필요. 전문의 상담 권고.",
      };
    case "CHRONIC_MANAGE_POOR":
      return {
        title: `문항 29-30: 만성질환 있음(${
          chronicCount ? "②+" : ""
        }) 관리 미흡(${chronicManage ? "④-" : ""})`,
        text: "당뇨·고혈압·심혈관/폐질환·우울/불안 등이 수면장애를 악화. 의사와 통합 관리 필요.",
      };
    default:
      return { title: "", text: "" };
  }
};

const SurveyResultProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const result = (route.params as any)?.result as SleepSurveyResultPayload;
  const [selectedCategory, setSelectedCategory] =
    useState<RoutineCategory>("환경관리");
  const [diagnosisDate, setDiagnosisDate] = useState<string>("");

  // 임시 루틴 데이터
  const routines: RoutineCardData[] = [
    {
      id: "1",
      imagePath: "assets/image/routine.svg",
      backgroundColor: "#1E3A5F",
      category: "환경관리",
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
      category: "생활습관",
    },
    {
      id: "4",
      imagePath: "assets/image/routine4.svg",
      backgroundColor: "#2E4A5F",
      category: "생활습관",
    },
    {
      id: "4",
      imagePath: "assets/image/routine5.svg",
      backgroundColor: "#2E4A5F",
      category: "건강&마음",
    },
    {
      id: "5",
      imagePath: "assets/image/routine6.svg",
      backgroundColor: "#2E4A5F",
      category: "건강&마음",
    },
  ];

  // 진단일 가져오기
  React.useEffect(() => {
    const fetchDiagnosisDate = async () => {
      const memberId = await getMemberId();
      if (!memberId || !result) return;

      const controller = new Controller({
        modelName: "SleepSurveyResponseResult",
        modelId: "sleep_survey_response_result",
      });
      const response = await controller.findAll({
        APP_MEMBER_IDENTIFICATION_CODE: memberId,
      });
      if (response?.status === 200 && response?.result?.rows?.length > 0) {
        // 최신 진단일 찾기
        const latestResult = response.result.rows[0];
        if (latestResult.CREATED_AT) {
          setDiagnosisDate(formatDate(latestResult.CREATED_AT));
        }
      }
    };
    fetchDiagnosisDate();
  }, [result]);

  const filteredRoutines = routines.filter(
    (routine) => routine.category === selectedCategory
  );

  // 두 개씩 묶어서 행으로 만들기
  const routineRows: RoutineCardData[][] = [];
  for (let i = 0; i < filteredRoutines.length; i += 2) {
    routineRows.push(filteredRoutines.slice(i, i + 2));
  }

  const levelColor = result ? getLevelColor(result.LEVEL_CODE) : "#63DB63";

  // 특별 권고 사항 생성
  const recommendations = useMemo(() => {
    if (!result) return [];
    const recs: Array<{ title: string; text: string }> = [];

    // FLAGS_JSON이 배열인지 확인하고, 문자열인 경우 파싱
    let flagsJson = result.FLAGS_JSON;
    if (!flagsJson) {
      return recs;
    }

    // 문자열인 경우 JSON 파싱 시도
    if (typeof flagsJson === "string") {
      try {
        flagsJson = JSON.parse(flagsJson);
      } catch (e) {
        console.error("Failed to parse FLAGS_JSON:", e);
        return recs;
      }
    }

    // 배열인지 확인
    if (!Array.isArray(flagsJson)) {
      return recs;
    }

    flagsJson.forEach((flag: any) => {
      const rec = getRecommendationText(
        flag,
        result.CHRONIC_COUNT_CHOICE_NO,
        result.CHRONIC_MANAGE_CHOICE_NO
      );
      if (rec.title) {
        recs.push(rec);
      }
    });

    return recs;
  }, [result]);

  if (!result) {
    return null;
  }

  return (
    <Screen>
      <Header title="수면 건강 진단 결과" />
      <ScrollableContent
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {diagnosisDate && (
            <DateBadge>
              <DateBadgeText>진단일 : {diagnosisDate}</DateBadgeText>
            </DateBadge>
          )}

          {/* 최근 진단 섹션 */}
          <DiagnosisSection>
            <DiagnosisStatusContainer>
              <DiagnosisIcon>
                {React.createElement(getIconSvg(result.LEVEL_CODE, false), {
                  width: 32,
                  height: 32,
                })}
              </DiagnosisIcon>
              <StatusLabel
                ko={result.LEVEL_LABEL_KO}
                en={result.LEVEL_LABEL_EN}
                color={levelColor}
                fontSize={18}
                marginBottom={24}
              />
            </DiagnosisStatusContainer>
            <DiagnosisDescription>
              {getResultMessage(result.LEVEL_CODE)}
            </DiagnosisDescription>
          </DiagnosisSection>

          {/* 특별 권고 사항 */}
          {recommendations.length > 0 && (
            <SpecialRecommendationsSection>
              <SectionTitle>
                <InformationCircleRedSvg width={28} height={28} />
                <SectionTitleText>특별 권고 사항</SectionTitleText>
              </SectionTitle>
              {recommendations.map((rec, index) => (
                <RecommendationCard key={index}>
                  <RecommendationTitle>{rec.title}</RecommendationTitle>
                  <RecommendationText>{rec.text}</RecommendationText>
                </RecommendationCard>
              ))}
            </SpecialRecommendationsSection>
          )}

          {/* 맞춤 수면 루틴 */}
          <RoutineSection>
            <RoutineTitleContainer>
              <RoutineNameText>김닥프</RoutineNameText>
              <RoutineTitleText>님의 맞춤 수면 루틴</RoutineTitleText>
            </RoutineTitleContainer>
            <FilterTabs
              tabs={["환경관리", "생활습관", "건강&마음"]}
              selectedTab={selectedCategory}
              onTabChange={(tab) => setSelectedCategory(tab as RoutineCategory)}
              size="small"
            />
            <RoutineCardsContainer>
              {routineRows.map((row, rowIndex) => (
                <RoutineCardsRow key={rowIndex}>
                  {row.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      id={routine.id}
                      imagePath={routine.imagePath}
                      backgroundColor={routine.backgroundColor}
                      onPress={() =>
                        navigation.navigate("CustomRoutine", { result })
                      }
                    />
                  ))}
                  {row.length === 1 && <EmptyCard />}
                </RoutineCardsRow>
              ))}
            </RoutineCardsContainer>
          </RoutineSection>
          <Divider />
          {/* 자가 진단 결과 섹션 (임시로 하나만 표시) */}
          <SelfDiagnosisTitle>자가 진단 결과</SelfDiagnosisTitle>
          <SelfDiagnosisItemHeader>
            <DiagnosisIcon>
              {React.createElement(getIconSvg(result.LEVEL_CODE, true), {
                width: 24,
                height: 24,
              })}
            </DiagnosisIcon>
            <StatusLabel
              ko={result.LEVEL_LABEL_KO}
              en={result.LEVEL_LABEL_EN}
              color={levelColor}
              fontSize={16}
            />
          </SelfDiagnosisItemHeader>
          <SelfDiagnosisTextContainer>
            <SelfDiagnosisItemText>
              {getResultMessage(result.LEVEL_CODE)}
            </SelfDiagnosisItemText>
          </SelfDiagnosisTextContainer>
        </Container>
      </ScrollableContent>
    </Screen>
  );
};

export default SurveyResultProfileScreen;
