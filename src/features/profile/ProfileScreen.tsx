import React, { useState, useCallback } from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ProfileStackParamList } from "../../app/navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Controller from "../../services/controller";
import { getMemberId } from "../../services/authService";
import ExcellentSvg from "../../../assets/icon/excellent.svg";
import GoodSvg from "../../../assets/icon/good.svg";
import CautionSvg from "../../../assets/icon/caution.svg";
import ProblematicSvg from "../../../assets/icon/problematic.svg";
import SevereSvg from "../../../assets/icon/servere.svg";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Profile"
>;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  padding: 40px 16px 40px 16px;
`;

// 상단 자가 수면 진단 섹션
const DiagnosisSection = styled.View`
  padding: 20px;
  align-items: center;
  border-radius: 16px;
  background-color: rgba(79, 107, 145, 0.24);
  margin-bottom: 16px;
`;

const DiagnosisTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 16px;
  margin-bottom: 5px;
`;

const SurveyHistoryLink = styled.TouchableOpacity`
  margin-bottom: 16px;
`;

const SurveyHistoryText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
`;

const InfoCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px 16px;
  align-items: center;
`;

const InfoCardStatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const InfoCardStatus = styled.Text<{ color: string }>`
  font-size: 16px;
  color: ${({ color }) => color};
`;

const StatusDivider = styled.View`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.gray400};
  margin: 0 12px;
`;

const InfoCardStatusEnglish = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${({ color }) => color};
`;

const InfoCardDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 25.6px;
  text-align: center;
`;

// 정밀 수면 분석 배너
const AnalysisBannerContainer = styled.View`
  margin-top: 16pz;
  margin-bottom: 40px;
`;

// 설정 및 고객센터 섹션
const SectionContainer = styled.View`
  margin-bottom: 40px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray700};
`;

const ListItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const ListItemIcon = styled.View`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const ListItemText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const ChevronIcon = styled(Ionicons)`
  color: ${({ theme }) => theme.colors.gray400};
`;

const getResultMessage = (levelCode: string): string => {
  switch (levelCode) {
    case "EXCELLENT":
      return "탄탄한 수면 건강. 현재 습관을 유지하세요.";
    case "GOOD_MINOR":
      return "가벼운 개선 포인트가 존재합니다.\n취침 전 루틴·카페인/스크린 관리로\n충분히 개선 가능합니다.";
    case "CAUTION":
      return "수면 중단·졸림·스트레스 중 1–2축에 부담.\n2–4주 행동교정(아래 권장안) + 필요 시 1차 상담 권고.";
    case "PROBLEMATIC":
      return "삶의 질에 영향. 수면위생 교정 + 수면 전문의/정신건강의학과/내과 상담을 권합니다.";
    case "SEVERE":
      return "안전·건강 위험. 전문가 평가를 우선 권고(수면무호흡·불면·과다졸림 감별 필요).";
    default:
      return "";
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

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const theme = useTheme();
  const [levelCode, setLevelCode] = useState<string | null>(null);
  const [levelLabels, setLevelLabels] = useState<{ ko: string; en: string }>({
    ko: "양호·소견 있음",
    en: "Good minor concerns",
  });

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
          const latestResult = response.result.rows[0];
          const fetchedLevelCode = latestResult.LEVEL_CODE;
          setLevelCode(fetchedLevelCode);
          // API에서 레이블을 가져오거나, 없으면 함수로 생성
          if (latestResult.LEVEL_LABEL_KO && latestResult.LEVEL_LABEL_EN) {
            setLevelLabels({
              ko: latestResult.LEVEL_LABEL_KO,
              en: latestResult.LEVEL_LABEL_EN,
            });
          } else {
            setLevelLabels(getLevelLabels(fetchedLevelCode));
          }
        } else {
          setLevelCode(null);
          setLevelLabels({ ko: "양호·소견 있음", en: "Good minor concerns" });
        }
      };
      fetchSurveyResults();
    }, [])
  );

  const levelColor = levelCode ? getLevelColor(levelCode) : "#63DB63";

  const settingsItems = [
    {
      icon: require("../../../assets/icon/profile.svg"),
      label: "내 정보",
      onPress: () => navigation.navigate("Setting"),
    },
    { icon: require("../../../assets/icon/target.svg"), label: "수면 목표" },
    {
      icon: require("../../../assets/icon/permission.svg"),
      label: "권한 관리",
      onPress: () => navigation.navigate("Auth"),
    },
    {
      icon: require("../../../assets/icon/device.svg"),
      label: "기기 연결 관리",
    },
    // {
    //   icon: require("../../../assets/icon/language.svg"),
    //   label: "언어",
    //   subtext: "한국어",
    // },
  ];

  const customerCenterItems = [
    {
      icon: require("../../../assets/icon/question.svg"),
      label: "자주 묻는 질문/ 공지",
      onPress: () => navigation.navigate("Support"),
    },
    {
      icon: require("../../../assets/icon/message.svg"),
      label: "문의하기",
      onPress: () => navigation.navigate("Qna"),
    },
    {
      icon: require("../../../assets/icon/presentation.svg"),
      label: "평가하기",
    },
    { icon: require("../../../assets/icon/lock.svg"), label: "개인정보 정책" },
  ];

  return (
    <Screen>
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          {/* 자가 수면 진단 섹션 */}
          <DiagnosisSection>
            {React.createElement(
              require("../../../assets/icon/cloud-moon.svg").default ||
                require("../../../assets/icon/cloud-moon.svg"),
              { width: 40, height: 40 }
            )}
            <DiagnosisTitle>자가 수면 진단</DiagnosisTitle>
            <SurveyHistoryLink
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Survey")}
            >
              <SurveyHistoryText>설문 내역 &gt;</SurveyHistoryText>
            </SurveyHistoryLink>
            <InfoCard>
              <InfoCardStatusContainer>
                <InfoCardStatus color={levelColor}>
                  {levelLabels.ko}
                </InfoCardStatus>
                <StatusDivider />
                <InfoCardStatusEnglish color={levelColor}>
                  {levelLabels.en}
                </InfoCardStatusEnglish>
              </InfoCardStatusContainer>
              <InfoCardDescription>
                {levelCode
                  ? getResultMessage(levelCode)
                  : getResultMessage("GOOD_MINOR")}
              </InfoCardDescription>
            </InfoCard>
          </DiagnosisSection>

          {/* 정밀 수면 분석 배너 */}
          <AnalysisBannerContainer>
            {React.createElement(
              require("../../../assets/image/marketing-banner.svg").default ||
                require("../../../assets/image/marketing-banner.svg"),
              { width: "100%", height: 120 }
            )}
          </AnalysisBannerContainer>

          {/* 설정 섹션 */}
          <SectionContainer>
            <SectionTitle>설정</SectionTitle>
            {settingsItems.map((item, index) => (
              <ListItem
                key={index}
                activeOpacity={1}
                style={{
                  borderBottomWidth: index === settingsItems.length - 1 ? 0 : 1,
                }}
                onPress={item.onPress}
              >
                <ListItemLeft>
                  <ListItemIcon>
                    {React.createElement(item.icon.default || item.icon, {
                      width: 24,
                      height: 24,
                    })}
                  </ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                  {/* {item.subtext && (
                    <ListItemSubtext>{item.subtext}</ListItemSubtext>
                  )} */}
                </ListItemLeft>
                <ChevronIcon name="chevron-forward" size={20} />
              </ListItem>
            ))}
          </SectionContainer>

          {/* 고객센터 섹션 */}
          <SectionContainer>
            <SectionTitle>고객센터</SectionTitle>
            {customerCenterItems.map((item, index) => (
              <ListItem
                key={index}
                activeOpacity={1}
                style={{
                  borderBottomWidth:
                    index === customerCenterItems.length - 1 ? 0 : 1,
                }}
                onPress={item.onPress}
              >
                <ListItemLeft>
                  <ListItemIcon>
                    {React.createElement(item.icon.default || item.icon, {
                      width: 24,
                      height: 24,
                    })}
                  </ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </ListItemLeft>
                <ChevronIcon name="chevron-forward" size={20} />
              </ListItem>
            ))}
          </SectionContainer>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default ProfileScreen;
