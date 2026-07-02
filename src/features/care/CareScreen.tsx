import React, { useState, useCallback } from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import { ScrollView, View, FlatList } from "react-native";
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

type RoutineCategory = "환경 관리" | "생활습관" | "건강&마음";

interface RoutineCardData {
  id: string;
  category: string;
  routineCardName: string;
  title: string;
  iconImageUrl: string | null;
  themeColorCode: string | null;
  actionList: string[];
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
    useState<RoutineCategory>("환경 관리");

  const [userName, setUserName] = useState<string>("사용자");
  const [sleepHelpItems, setSleepHelpItems] = useState<any[]>([]);
  const [healthStoryItems, setHealthStoryItems] = useState<any[]>([]);
  const [medicalDeviceItems, setMedicalDeviceItems] = useState<any[]>([]);
  const [routines, setRoutines] = useState<RoutineCardData[]>([]);

  const filteredRoutines = routines.filter(
    (r) => r.category === selectedRoutineCategory,
  );

  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        const memberId = await getMemberId();
        if (!memberId) return;

        // 1. 사용자 이름
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

        // 2. 자가진단 결과
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

        // 3. 루틴 카드 (ResultRoutine API)
        try {
          const routineController = new Controller({
            modelName: "ResultRoutine",
            modelId: "result_routine",
          });
          const routineRes = await routineController.findAll({});
          if (routineRes?.status === 200) {
            const rows = routineRes.result?.rows ?? routineRes.result ?? [];
            const parsed: RoutineCardData[] = rows.map((item: any) => {
              // ACTION_LIST 파싱
              let actionList: string[] = [];
              try {
                actionList =
                  typeof item.ACTION_LIST === "string"
                    ? JSON.parse(item.ACTION_LIST)
                    : (item.ACTION_LIST ?? []);
              } catch {
                actionList = [];
              }

              // ✅ ICON_IMAGE_URL / IMAGE_URL JSON 배열 파싱
              let iconImageUrl: string | null = null;
              const rawUrl = item.ICON_IMAGE_URL ?? item.IMAGE_URL ?? null;
              if (typeof rawUrl === "string" && rawUrl.trim().startsWith("[")) {
                try {
                  const parsed = JSON.parse(rawUrl);
                  iconImageUrl =
                    Array.isArray(parsed) && parsed.length > 0
                      ? parsed[0]
                      : null;
                } catch {
                  iconImageUrl = rawUrl;
                }
              } else {
                iconImageUrl = rawUrl;
              }

              return {
                id: String(item.RESULT_ROUTINE_IDENTIFICATION_CODE),
                category: item.CATEGORY,
                routineCardName: item.ROUTINE_CARD_NAME,
                title: item.TITLE,
                iconImageUrl,
                themeColorCode: item.THEME_COLOR_CODE ?? null,
                actionList,
              };
            });
            setRoutines(parsed);
            console.log(parsed);
          }
        } catch (e) {
          console.error("루틴 카드 조회 실패:", e);
        }

        // 4. 수면 도움 콘텐츠
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

        // 5. 건강 이야기
        try {
          const healthController = new Controller({
            modelName: "HealthStoryContent",
            modelId: "health_story_content",
          });
          const healthRes = await healthController.findAll({ IS_EXPOSED: "Y" });
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
                content: item.CONTENT,
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

        // 6. 수면 의료기기
        try {
          const deviceController = new Controller({
            modelName: "CareDevice",
            modelId: "care_device",
          });
          const deviceRes = await deviceController.findAll({ IS_EXPOSED: "Y" });
          if (deviceRes?.status === 200) {
            const rows = deviceRes.result?.rows ?? deviceRes.result ?? [];
            setMedicalDeviceItems(
              rows.slice(0, 4).map((item: any) => {
                let imageUrl = null;
                if (item.IMAGE_URL) {
                  try {
                    imageUrl = JSON.parse(item.IMAGE_URL)[0];
                  } catch {
                    imageUrl = item.IMAGE_URL;
                  }
                }
                return {
                  id: String(item.CARE_DEVICE_IDENTIFICATION_CODE),
                  image: imageUrl
                    ? { uri: imageUrl }
                    : require("../../../assets/image/bed.png"),
                  title: item.NAME,
                  productLink: item.PRODUCT_LINK,
                };
              }),
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
            <TitleContainer>
              <Name>{userName}</Name>
              <Title>님의 맞춤 수면 루틴</Title>
            </TitleContainer>

            {levelCode ? (
              <RoutineSection>
                <FilterTabs
                  tabs={["환경 관리", "생활습관", "건강&마음"]}
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
                      category={item.category}
                      routineCardName={item.routineCardName}
                      title={item.title}
                      iconImageUrl={item.iconImageUrl}
                      themeColorCode={item.themeColorCode}
                      actionList={item.actionList}
                    />
                  )}
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                />
              </RoutineSection>
            ) : (
              <>
                <Subtitle>
                  더 나은 수면, 첫 걸음은 내 수면 상태를 아는 것입니다.
                </Subtitle>
                <MainButtonContainer onPress={() => {}} activeOpacity={1}>
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
            onItemPress={(item) =>
              navigation.navigate("HealthStoryDetail", { item })
            }
          />

          <Divider />

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
