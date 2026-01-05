import React, { useState, useCallback } from "react";
import styled, { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Controller from "../../../services/controller";
import { getMemberId } from "../../../services/authService";
import Header from "../../../shared/components/common/Header";
import Button from "../../../shared/components/common/Button";
import FilterTabs from "../../../shared/components/common/FilterTabs";
import StatusLabel from "../../../shared/components/common/StatusLabel";
import { SleepSurveyResultPayload } from "../../../shared/utils/sleepSurveyCalculator";

type SurveyScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Survey"
>;

interface SurveyResult {
  ID?: string;
  CREATED_AT: string;
  LEVEL_CODE: string;
  LEVEL_LABEL_KO: string;
  LEVEL_LABEL_EN: string;
  TOTAL_SHT?: number;
  SUB_SLEEP_QUALITY?: number;
  SUB_DAYTIME_SLEEPINESS?: number;
  SUB_INSOMNIA?: number;
  SUB_STRESS?: number;
  FLAGS_JSON?: Array<{ type: string; questionNo: number; choiceNo: number }>;
  CHRONIC_COUNT_CHOICE_NO?: number;
  CHRONIC_MANAGE_CHOICE_NO?: number;
  RESULT_TEXT_KEY?: string;
}

type FilterType = "전체" | "최근 3개월" | "최근 6개월";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px;
`;

// 최근 진단 섹션
const RecentDiagnosisSection = styled.View`
  margin-bottom: 40px;
`;

const RecentDiagnosisCard = styled.View`
  background-color: ${({ theme }) => theme.colors.gray1000};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
  margin-bottom: 16px;
`;

const RecentDiagnosisCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DateText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
  margin-bottom: 16px;
`;

const DetailLink = styled.TouchableOpacity`
  align-self: flex-end;
`;

const DetailLinkText = styled(DateText)``;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 24px;
  margin-bottom: 16px;
`;

const NewDiagnosisButton = styled(Button)`
  width: 100%;
`;

// 진단 기록 섹션
const HistorySection = styled.View`
  margin-bottom: 32px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const FilterContainer = styled.View`
  margin-bottom: 16px;
`;

const HistoryList = styled.View``;

const HistoryItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 0 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray700};
`;

const HistoryItemLeft = styled.View`
  flex: 1;
`;

const HistoryDateText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const ChevronIcon = styled(Ionicons)`
  color: ${({ theme }) => theme.colors.gray400};
`;

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

const getLevelLabels = (levelCode: string): { ko: string; en: string } => {
  switch (levelCode) {
    case "EXCELLENT":
      return { ko: "매우 양호", en: "Excellent" };
    case "GOOD_MINOR":
      return { ko: "양호·소견 있음", en: "Good minor concerns" };
    case "CAUTION":
      return { ko: "주의", en: "Caution" };
    case "PROBLEMATIC":
      return { ko: "문제성", en: "Problematic" };
    case "SEVERE":
      return { ko: "심각", en: "Severe" };
    default:
      return { ko: "양호·소견 있음", en: "Good minor concerns" };
  }
};

const getResultMessage = (levelCode: string): string => {
  switch (levelCode) {
    case "EXCELLENT":
      return "탄탄한 수면 건강. 현재 습관을 유지하세요.";
    case "GOOD_MINOR":
      return "가벼운 개선 포인트가 존재합니다.\n취침 전 루틴·카페인/스크린 관리로 충분히 개선 가능합니다.";
    case "CAUTION":
      return "수면 중단·졸림·스트레스 중 1–2축에 부담.\n2–4주 행동교정(아래 권장안) + 필요 시 1차 상담 권고.";
    case "PROBLEMATIC":
      return "삶의 질에 영향. 수면위생 교정 + 수면 전문의/정신건강의학과/내과 상담을 권합니다.";
    case "SEVERE":
      return "안전·건강 위험. 전문가 평가를 우선 권고(수면무호흡·불면·과다졸림 감별 필요).";
    default:
      return "가벼운 개선 포인트가 존재합니다.\n취침 전 루틴·카페인/스크린 관리로 충분히 개선 가능합니다.";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const filterByDateRange = (
  results: SurveyResult[],
  filter: FilterType
): SurveyResult[] => {
  if (filter === "전체") {
    return results;
  }

  const now = new Date();
  const monthsToSubtract = filter === "최근 3개월" ? 3 : 6;
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

  return results.filter((result) => {
    const resultDate = new Date(result.CREATED_AT);
    return resultDate >= cutoffDate;
  });
};

const SurveyScreen = () => {
  const navigation = useNavigation<SurveyScreenNavigationProp>();
  const theme = useTheme();
  const [recentDiagnosis, setRecentDiagnosis] = useState<SurveyResult | null>(
    null
  );
  const [allResults, setAllResults] = useState<SurveyResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("전체");

  useFocusEffect(
    useCallback(() => {
      const fetchSurveyResults = async () => {
        const memberId = await getMemberId();
        if (!memberId) {
          return;
        }
        const controller = new Controller({
          modelName: "SleepSurveyResponseResult",
          modelId: "sleep_survey_response_result",
        });
        const response = await controller.findAll({
          APP_MEMBER_IDENTIFICATION_CODE: memberId,
        });
        if (response?.status === 200 && response?.result?.rows?.length > 0) {
          const results = response.result.rows.map((row: any) => ({
            ID: row.ID,
            CREATED_AT: row.CREATED_AT,
            LEVEL_CODE: row.LEVEL_CODE,
            LEVEL_LABEL_KO:
              row.LEVEL_LABEL_KO || getLevelLabels(row.LEVEL_CODE).ko,
            LEVEL_LABEL_EN:
              row.LEVEL_LABEL_EN || getLevelLabels(row.LEVEL_CODE).en,
            TOTAL_SHT: row.TOTAL_SHT,
            SUB_SLEEP_QUALITY: row.SUB_SLEEP_QUALITY,
            SUB_DAYTIME_SLEEPINESS: row.SUB_DAYTIME_SLEEPINESS,
            SUB_INSOMNIA: row.SUB_INSOMNIA,
            SUB_STRESS: row.SUB_STRESS,
            FLAGS_JSON: row.FLAGS_JSON,
            CHRONIC_COUNT_CHOICE_NO: row.CHRONIC_COUNT_CHOICE_NO,
            CHRONIC_MANAGE_CHOICE_NO: row.CHRONIC_MANAGE_CHOICE_NO,
            RESULT_TEXT_KEY: row.RESULT_TEXT_KEY,
          }));

          // 최신순으로 정렬
          const sortedResults = results.sort(
            (a: SurveyResult, b: SurveyResult) => {
              return (
                new Date(b.CREATED_AT).getTime() -
                new Date(a.CREATED_AT).getTime()
              );
            }
          );

          setRecentDiagnosis(sortedResults[0]);
          setAllResults(sortedResults);
        } else {
          setRecentDiagnosis(null);
          setAllResults([]);
        }
      };
      fetchSurveyResults();
    }, [])
  );

  const filteredResults = filterByDateRange(allResults, selectedFilter);

  const recentLevelColor = recentDiagnosis
    ? getLevelColor(recentDiagnosis.LEVEL_CODE)
    : "#63DB63";
  const recentLevelLabels = recentDiagnosis
    ? {
        ko: recentDiagnosis.LEVEL_LABEL_KO,
        en: recentDiagnosis.LEVEL_LABEL_EN,
      }
    : getLevelLabels("GOOD_MINOR");

  const handleNewDiagnosis = async () => {
    const memberId = await getMemberId();
    navigation.navigate("SelfTest", { id: memberId || undefined });
  };

  const handleDetailPress = () => {
    if (!recentDiagnosis) return;
    const resultPayload: SleepSurveyResultPayload = {
      TOTAL_SHT: recentDiagnosis.TOTAL_SHT || 0,
      LEVEL_CODE: recentDiagnosis.LEVEL_CODE as any,
      LEVEL_LABEL_KO: recentDiagnosis.LEVEL_LABEL_KO,
      LEVEL_LABEL_EN: recentDiagnosis.LEVEL_LABEL_EN,
      SUB_SLEEP_QUALITY: recentDiagnosis.SUB_SLEEP_QUALITY || 0,
      SUB_DAYTIME_SLEEPINESS: recentDiagnosis.SUB_DAYTIME_SLEEPINESS || 0,
      SUB_INSOMNIA: recentDiagnosis.SUB_INSOMNIA || 0,
      SUB_STRESS: recentDiagnosis.SUB_STRESS || 0,
      FLAGS_JSON: (recentDiagnosis.FLAGS_JSON || []) as any,
      CHRONIC_COUNT_CHOICE_NO: recentDiagnosis.CHRONIC_COUNT_CHOICE_NO,
      CHRONIC_MANAGE_CHOICE_NO: recentDiagnosis.CHRONIC_MANAGE_CHOICE_NO,
      RESULT_TEXT_KEY: recentDiagnosis.RESULT_TEXT_KEY,
    };
    navigation.navigate("SurveyResultProfile", { result: resultPayload });
  };

  const handleResultPress = (result: SurveyResult) => {
    const resultPayload: SleepSurveyResultPayload = {
      TOTAL_SHT: result.TOTAL_SHT || 0,
      LEVEL_CODE: result.LEVEL_CODE as any,
      LEVEL_LABEL_KO: result.LEVEL_LABEL_KO,
      LEVEL_LABEL_EN: result.LEVEL_LABEL_EN,
      SUB_SLEEP_QUALITY: result.SUB_SLEEP_QUALITY || 0,
      SUB_DAYTIME_SLEEPINESS: result.SUB_DAYTIME_SLEEPINESS || 0,
      SUB_INSOMNIA: result.SUB_INSOMNIA || 0,
      SUB_STRESS: result.SUB_STRESS || 0,
      FLAGS_JSON: (result.FLAGS_JSON || []) as any,
      CHRONIC_COUNT_CHOICE_NO: result.CHRONIC_COUNT_CHOICE_NO,
      CHRONIC_MANAGE_CHOICE_NO: result.CHRONIC_MANAGE_CHOICE_NO,
      RESULT_TEXT_KEY: result.RESULT_TEXT_KEY,
    };
    navigation.navigate("SurveyResultProfile", { result: resultPayload });
  };

  return (
    <Screen>
      <Header title="자가 수면 건강 진단 내역" />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          {/* 최근 진단 섹션 */}
          <RecentDiagnosisSection>
            {recentDiagnosis && (
              <RecentDiagnosisCard>
                <RecentDiagnosisCardHeader>
                  <DateText>{formatDate(recentDiagnosis.CREATED_AT)}</DateText>
                  <DetailLink onPress={handleDetailPress}>
                    <DetailLinkText>진단 상세 &gt;</DetailLinkText>
                  </DetailLink>
                </RecentDiagnosisCardHeader>
                <StatusLabel
                  ko={recentLevelLabels.ko}
                  en={recentLevelLabels.en}
                  color={recentLevelColor}
                  fontSize={16}
                  marginBottom={12}
                />
                <DescriptionText>
                  {getResultMessage(recentDiagnosis.LEVEL_CODE)}
                </DescriptionText>
              </RecentDiagnosisCard>
            )}
            <NewDiagnosisButton variant="block" onPress={handleNewDiagnosis}>
              신규 진단 하기
            </NewDiagnosisButton>
          </RecentDiagnosisSection>

          {/* 진단 기록 섹션 */}
          <HistorySection>
            <SectionTitle>진단 기록</SectionTitle>
            <FilterContainer>
              <FilterTabs
                tabs={["전체", "최근 3개월", "최근 6개월"]}
                selectedTab={selectedFilter}
                onTabChange={(tab) => setSelectedFilter(tab as FilterType)}
              />
            </FilterContainer>
            <HistoryList>
              {filteredResults.map((result, index) => {
                const levelColor = getLevelColor(result.LEVEL_CODE);
                const levelLabels = {
                  ko: result.LEVEL_LABEL_KO,
                  en: result.LEVEL_LABEL_EN,
                };
                return (
                  <HistoryItem
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => handleResultPress(result)}
                    style={{
                      borderBottomWidth:
                        index === filteredResults.length - 1 ? 0 : 1,
                    }}
                  >
                    <HistoryItemLeft>
                      <HistoryDateText>
                        {formatDate(result.CREATED_AT)} 자가진단
                      </HistoryDateText>
                      <StatusLabel
                        ko={levelLabels.ko}
                        en={levelLabels.en}
                        color={levelColor}
                        fontSize={16}
                      />
                    </HistoryItemLeft>
                    <ChevronIcon name="chevron-forward" size={20} />
                  </HistoryItem>
                );
              })}
            </HistoryList>
          </HistorySection>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default SurveyScreen;
