import React, { useState, useCallback } from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import { ScrollView, View, Dimensions, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Controller from "../../services/controller";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import CareSection from "./components/CareSection";
import { getMemberId } from "../../services/authService";
import FilterTabs from "../../shared/components/common/FilterTabs";
import RoutineCard from "../../shared/components/common/RoutineCard";

type NavigationProp = NativeStackNavigationProp<CareStackParamList, "Care">;

// =====================
// Styled Components
// =====================

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled(ScrollView)`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px;
`;

const HeaderGradientBackground = styled(LinearGradient)`
  padding-top: 16px;
`;

const HeaderContainer = styled.View`
  padding: 16px;
  padding-top: 66px;
`;

const TitleContainer = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
  line-height: 28.8px;
`;

const MainButtonContainer = styled.TouchableOpacity`
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

const GradientBackground = styled(LinearGradient)`
  height: 56px;
  align-items: center;
  justify-content: center;
`;

const MainButtonText = styled.Text`
  font-size: 19px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const RoutineSection = styled.View``;

// =====================
// Types
// =====================

type RoutineCategory = "환경관리" | "생활습관" | "건강&마음";

interface RoutineCardData {
  id: string;
  imagePath: string;
  backgroundColor: string;
  category: RoutineCategory;
}

// =====================
// Helpers
// =====================

const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  );
  return match ? match[1] : null;
};

const getYoutubeThumbnail = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

// =====================
// Component
// =====================

const CareScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [selectedCategory, setSelectedCategory] = useState<string>("소리");
  const [levelCode, setLevelCode] = useState<string | null>(null);
  const [selectedRoutineCategory, setSelectedRoutineCategory] =
    useState<RoutineCategory>("환경관리");

  // ✅ 실제 데이터 상태
  const [userName, setUserName] = useState<string>("사용자");
  const [sleepHelpItems, setSleepHelpItems] = useState<any[]>([]);
  const [healthStoryItems, setHealthStoryItems] = useState<any[]>([]);
  const [medicalDeviceItems, setMedicalDeviceItems] = useState<any[]>([]);

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
      id: "5",
      imagePath: "assets/image/routine5.svg",
      backgroundColor: "#4A3E5F",
      category: "건강&마음",
    },
    {
      id: "6",
      imagePath: "assets/image/routine6.svg",
      backgroundColor: "#5A4E6F",
      category: "건강&마음",
    },
  ];

  const filteredRoutines = routines.filter(
    (r) => r.category === selectedRoutineCategory,
  );

  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        const memberId = await getMemberId();
        if (!memberId) return;

        // ✅ 1. 사용자 이름
        try {
          const memberController = new Controller({
            modelName: "AppMember",
            modelId: "app_member",
          });
          const memberRes = await memberController.findOne({
            APP_MEMBER_IDENTIFICATION_CODE: memberId,
          });
          const name =
            memberRes?.data?.data?.USER_NAME ??
            memberRes?.result?.USER_NAME ??
            "사용자";
          setUserName(name);
        } catch (e) {
          console.error("사용자 정보 조회 실패:", e);
        }

        // ✅ 2. 자가진단 결과
        try {
          const surveyController = new Controller({
            modelName: "SleepSurveyResponseResult",
            modelId: "sleep_survey_response_result",
          });
          const surveyRes = await surveyController.findAll({
            APP_MEMBER_IDENTIFICATION_CODE: memberId,
          });
          if (
            surveyRes?.status === 200 &&
            surveyRes?.result?.rows?.length > 0
          ) {
            setLevelCode(surveyRes.result.rows[0].LEVEL_CODE);
          } else {
            setLevelCode(null);
          }
        } catch (e) {
          console.error("자가진단 결과 조회 실패:", e);
        }

        // ✅ 3. 수면 도움 콘텐츠 (SleepHelpContent)
        try {
          const contentController = new Controller({
            modelName: "SleepHelpContent",
            modelId: "sleep_help_content",
          });
          const contentRes = await contentController.findAll({});
          if (contentRes?.status === 200) {
            const rows = contentRes.result?.rows ?? contentRes.result ?? [];
            const enriched = rows.map((item: any) => {
              const youtubeId = extractYoutubeId(item.CONTENT_FILE_URL);
              const thumbnail =
                item.THUMBNAIL_IMAGE_URL ||
                (youtubeId ? getYoutubeThumbnail(youtubeId) : null);
              return {
                id: String(item.SLEEP_HELP_CONTENT_IDENTIFICATION_CODE),
                image: thumbnail
                  ? { uri: thumbnail }
                  : require("../../../assets/image/sing.png"),
                title: item.TITLE,
                category: item.CATEGORY,
              };
            });
            setSleepHelpItems(enriched.slice(0, 4));
          }
        } catch (e) {
          console.error("수면 도움 콘텐츠 조회 실패:", e);
          setSleepHelpItems([
            {
              id: "1",
              image: require("../../../assets/image/sing.png"),
              title: "싱잉볼 테라피",
            },
            {
              id: "2",
              image: require("../../../assets/image/sing.png"),
              title: "피아노",
            },
          ]);
        }

        // ✅ 4. 건강 이야기 (HealthStoryContent)
        try {
          const healthController = new Controller({
            modelName: "HealthStoryContent",
            modelId: "health_story_content",
          });
          const healthRes = await healthController.findAll({
            IS_EXPOSED: "Y",
          });
          if (healthRes?.status === 200) {
            const rows = healthRes.result?.rows ?? healthRes.result ?? [];
            setHealthStoryItems(
              rows.slice(0, 4).map((item: any) => ({
                id: String(item.HEALTH_STORY_CONTENT_IDENTIFICATION_CODE),
                image: item.THUMBNAIL_IMAGE_URL
                  ? { uri: JSON.parse(item.THUMBNAIL_IMAGE_URL)[0] }
                  : require("../../../assets/image/ground.png"),
                title: item.TITLE,
                category: item.CATEGORY,
              })),
            );
          }
        } catch (e) {
          console.error("건강 이야기 조회 실패:", e);
          setHealthStoryItems([
            {
              id: "1",
              image: require("../../../assets/image/ground.png"),
              title: "그라운딩, 어싱 이란?",
            },
            {
              id: "2",
              image: require("../../../assets/image/ground2.png"),
              title: "꿀잠, 꿀팁",
            },
          ]);
        }

        // ✅ 5. 수면 의료기기 (CareDevice)
        try {
          const deviceController = new Controller({
            modelName: "CareDevice",
            modelId: "care_device",
          });
          const deviceRes = await deviceController.findAll({
            IS_EXPOSED: "Y",
          });
          if (deviceRes?.status === 200) {
            const rows = deviceRes.result?.rows ?? deviceRes.result ?? [];
            setMedicalDeviceItems(
              rows.slice(0, 4).map((item: any) => ({
                id: String(item.CARE_DEVICE_IDENTIFICATION_CODE),
                image: item.IMAGE_URL
                  ? { uri: item.IMAGE_URL }
                  : require("../../../assets/image/bed.png"),
                title: item.NAME,
                productLink: item.PRODUCT_LINK,
              })),
            );
          }
        } catch (e) {
          console.error("수면 의료기기 조회 실패:", e);
          setMedicalDeviceItems([
            {
              id: "1",
              image: require("../../../assets/image/bed.png"),
              title: "어싱 닥터프렌드(매트)",
            },
            {
              id: "2",
              image: require("../../../assets/image/bed2.png"),
              title: "뉴슬립패드",
            },
          ]);
        }
      };

      fetchAll();
    }, []),
  );

  return (
    <Screen>
      <ScrollableContent>
        <HeaderGradientBackground
          colors={["#09182C", "#161B45", "#1F587D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.5, 1]}
        >
          <HeaderContainer>
            {/* ✅ 실제 사용자 이름 */}
            <TitleContainer>
              <Name>{userName}</Name>
              <Title>님의 맞춤 수면 루틴</Title>
            </TitleContainer>

            {levelCode ? (
              <RoutineSection>
                <FilterTabs
                  tabs={["환경관리", "생활습관", "건강&마음"]}
                  selectedTab={selectedRoutineCategory}
                  onTabChange={(tab) =>
                    setSelectedRoutineCategory(tab as RoutineCategory)
                  }
                  size="small"
                />
                <FlatList
                  data={filteredRoutines}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <RoutineCard
                      id={item.id}
                      imagePath={item.imagePath}
                      backgroundColor={item.backgroundColor}
                    />
                  )}
                  contentContainerStyle={{ paddingRight: 16 }}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                />
              </RoutineSection>
            ) : (
              <>
                <Subtitle>
                  더 나은 수면, 첫 걸음은 내 수면 상태를 아는 것입니다.
                </Subtitle>
                <MainButtonContainer
                  onPress={() => {
                    // 수면 건강 진단하기 버튼 액션
                  }}
                  activeOpacity={1}
                >
                  <GradientBackground
                    colors={["#7353FF", "#25C3FB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <MainButtonText>나의 수면 건강 진단하기</MainButtonText>
                  </GradientBackground>
                </MainButtonContainer>
              </>
            )}
          </HeaderContainer>
        </HeaderGradientBackground>

        <Content>
          {/* ✅ 수면 도움 콘텐츠 */}
          <CareSection
            title="수면을 위한 도움"
            description="수면을 위한 사운드로 편안히 주무세요."
            items={
              sleepHelpItems.length > 0
                ? sleepHelpItems
                : [
                    {
                      id: "1",
                      image: require("../../../assets/image/sing.png"),
                      title: "싱잉볼 테라피",
                    },
                    {
                      id: "2",
                      image: require("../../../assets/image/sing.png"),
                      title: "피아노",
                    },
                  ]
            }
            categories={["소리", "음악", "호흡", "스트레칭"]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onMorePress={() =>
              navigation.navigate("SleepHelpList", {
                category: selectedCategory,
              })
            }
          />

          <Divider />

          {/* ✅ 건강 이야기 */}
          <CareSection
            title="건강 이야기"
            description={`수면과 건강에 대한 올바른 정보와\n다양한 이야기를 만나보세요.`}
            items={
              healthStoryItems.length > 0
                ? healthStoryItems
                : [
                    {
                      id: "1",
                      image: require("../../../assets/image/ground.png"),
                      title: "그라운딩, 어싱 이란?",
                    },
                    {
                      id: "2",
                      image: require("../../../assets/image/ground2.png"),
                      title: "꿀잠, 꿀팁",
                    },
                  ]
            }
            onMorePress={() => navigation.navigate("HealthStoryList")}
          />

          <Divider />

          {/* ✅ 수면 의료기기 */}
          <CareSection
            title="수면 의료기기"
            description={`닥터프렌드 제품과 함께하는 체계적인 수면 케어를\n제공합니다.`}
            items={
              medicalDeviceItems.length > 0
                ? medicalDeviceItems
                : [
                    {
                      id: "1",
                      image: require("../../../assets/image/bed.png"),
                      title: "어싱 닥터프렌드(매트)",
                    },
                    {
                      id: "2",
                      image: require("../../../assets/image/bed2.png"),
                      title: "뉴슬립패드",
                    },
                  ]
            }
            onMorePress={() => navigation.navigate("MedicalDeviceList")}
          />
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default CareScreen;
