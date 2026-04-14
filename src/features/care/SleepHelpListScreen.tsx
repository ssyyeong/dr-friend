import React, { useEffect, useState, useRef } from "react";
import styled, { useTheme } from "styled-components/native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import Header from "../../shared/components/common/Header";
import Controller from "../../services/controller";
import * as WebBrowser from "expo-web-browser";

type SleepHelpListRouteProp = RouteProp<CareStackParamList, "SleepHelpList">;
type NavigationProp = NativeStackNavigationProp<
  CareStackParamList,
  "SleepHelpList"
>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// =====================
// Styled Components
// =====================

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
`;

const DescriptionContainer = styled.View`
  padding: 16px;
  padding-bottom: 32px;
`;

const DescriptionTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

const DescriptionLine = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 24px;
`;

const CategoryContainer = styled.View`
  flex-direction: row;
  padding-horizontal: 16px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const CategoryButton = styled(TouchableOpacity)<{ active: boolean }>`
  margin-right: 16px;
  padding-top: 16px;
`;

const CategoryText = styled.Text<{ active: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ active, theme }) =>
    active ? theme.colors.text : theme.colors.gray400};
  ${({ active, theme }) =>
    active
      ? `padding-bottom: 16px; border-bottom-width: 2px; border-bottom-color: ${theme.colors.text};`
      : "padding-bottom: 16px;"}
`;

const ListContainer = styled.View`
  flex: 1;
  padding-vertical: 24px;
  padding-horizontal: 16px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const ItemContainer = styled.TouchableOpacity<{ isPlaying: boolean }>`
  width: 48%;
  margin-bottom: 20px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  align-items: flex-start;
`;

const ItemImageContainer = styled.View<{ isPlaying: boolean }>`
  width: 100%;
  height: 120px;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  border-width: ${({ isPlaying }) => (isPlaying ? 2 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const ItemImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const PlayButtonOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ItemContent = styled.View`
  width: 100%;
  padding-top: 8px;
`;

const ItemTitle = styled.Text<{ isPlaying: boolean }>`
  font-size: 16px;
  color: ${({ theme, isPlaying }) =>
    isPlaying ? theme.colors.primary : theme.colors.text};
  text-align: left;
`;

// 하단 플레이어 바
const PlayerBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.gray800};
  padding: 12px 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.gray600};
`;

const PlayerLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const PlayerTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 8px;
  flex: 1;
`;

const PlayerStopButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

// 유튜브 모달
const YoutubeModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.9);
  justify-content: center;
  align-items: center;
`;

const YoutubeModalContent = styled.View`
  width: ${SCREEN_WIDTH}px;
  background-color: #000;
`;

const YoutubeModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
`;

const YoutubeModalTitle = styled.Text`
  font-size: 16px;
  color: #fff;
  flex: 1;
  margin-right: 12px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

// =====================
// Helpers
// =====================

// 유튜브 URL에서 video ID 추출
const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// 유튜브 썸네일 URL 생성
const getYoutubeThumbnail = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

// 유튜브 임베드 URL 생성
const getYoutubeEmbedUrl = (videoId: string): string =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

// =====================
// Component
// =====================

const SleepHelpListScreen = () => {
  const route = useRoute<SleepHelpListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const initialCategory = route.params?.category || "소리";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [items, setItems] = useState<any[]>([]);
  const [playingItem, setPlayingItem] = useState<any | null>(null);
  const [isYoutubeModalVisible, setIsYoutubeModalVisible] = useState(false);

  const categories = ["소리", "음악", "호흡", "스트레칭"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const controller = new Controller({
          modelName: "SleepHelpContent",
          modelId: "sleep_help_content",
        });
        const response = await controller.findAll({});
        if (response?.status === 200) {
          const rows = response.result.rows ?? response.result ?? [];
          // 유튜브 썸네일 자동 적용
          const enriched = rows.map((item: any) => {
            const youtubeId = extractYoutubeId(item.CONTENT_FILE_URL);
            return {
              ...item,
              youtubeId,
              thumbnailUrl:
                item.THUMBNAIL_IMAGE_URL ||
                (youtubeId ? getYoutubeThumbnail(youtubeId) : null),
            };
          });
          setItems(enriched);
        }
      } catch (e) {
        console.error("콘텐츠 불러오기 실패:", e);
      }
    };
    fetchItems();
  }, []);

  // 카테고리 필터링
  const filteredItems = items.filter(
    (item) => item.CATEGORY === selectedCategory,
  );

  // 아이템 클릭 → 유튜브 모달 열기
  const handleItemPress = (item: any) => {
    setPlayingItem(item);
    setIsYoutubeModalVisible(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsYoutubeModalVisible(false);
  };

  // 하단 플레이어 정지
  const handleStop = () => {
    setPlayingItem(null);
    setIsYoutubeModalVisible(false);
  };

  return (
    <Screen>
      <Header title="" />
      <Content>
        <DescriptionContainer>
          <DescriptionTitle>수면을 위한 도움</DescriptionTitle>
          <DescriptionLine>몸과 마음을 이완시키는</DescriptionLine>
          <DescriptionLine>
            다양한 수면 도움 콘텐츠를 만나보세요.
          </DescriptionLine>
        </DescriptionContainer>

        <CategoryContainer>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={1}
            >
              <CategoryText active={selectedCategory === category}>
                {category}
              </CategoryText>
            </CategoryButton>
          ))}
        </CategoryContainer>

        <ListContainer>
          <FlatList
            data={filteredItems}
            numColumns={2}
            keyExtractor={(item) =>
              String(item.SLEEP_HELP_CONTENT_IDENTIFICATION_CODE || item.id)
            }
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => {
              const isPlaying =
                playingItem?.SLEEP_HELP_CONTENT_IDENTIFICATION_CODE ===
                item.SLEEP_HELP_CONTENT_IDENTIFICATION_CODE;
              return (
                <ItemContainer
                  isPlaying={isPlaying}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.8}
                >
                  <ItemImageContainer isPlaying={isPlaying}>
                    {item.thumbnailUrl ? (
                      <ItemImage
                        source={{ uri: item.thumbnailUrl }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: theme.colors.gray600,
                        }}
                      />
                    )}
                    <PlayButtonOverlay>
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={32}
                        color="#fff"
                      />
                    </PlayButtonOverlay>
                  </ItemImageContainer>
                  <ItemContent>
                    <ItemTitle isPlaying={isPlaying}>{item.TITLE}</ItemTitle>
                  </ItemContent>
                </ItemContainer>
              );
            }}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <View style={{ alignItems: "center", paddingTop: 40 }}>
                <DescriptionLine>콘텐츠가 없습니다.</DescriptionLine>
              </View>
            }
          />
        </ListContainer>

        {/* ✅ 하단 플레이어 바 */}
        {playingItem && !isYoutubeModalVisible && (
          <PlayerBar>
            <PlayerLeft>
              <Ionicons
                name="musical-notes"
                size={20}
                color={theme.colors.primary}
              />
              <PlayerTitle numberOfLines={1}>{playingItem.TITLE}</PlayerTitle>
            </PlayerLeft>
            <TouchableOpacity
              onPress={() => setIsYoutubeModalVisible(true)}
              style={{ marginRight: 8 }}
            >
              <Ionicons name="play" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <PlayerStopButton onPress={handleStop}>
              <Ionicons name="pause" size={18} color="#fff" />
            </PlayerStopButton>
          </PlayerBar>
        )}
      </Content>

      {/* ✅ 유튜브 플레이어 모달 */}
      <Modal
        visible={isYoutubeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <YoutubeModalOverlay>
          <YoutubeModalContent>
            <YoutubeModalHeader>
              <YoutubeModalTitle numberOfLines={1}>
                {playingItem?.TITLE}
              </YoutubeModalTitle>
              <CloseButton onPress={handleCloseModal}>
                <Ionicons name="chevron-down" size={24} color="#fff" />
              </CloseButton>
            </YoutubeModalHeader>

            {playingItem?.youtubeId ? (
              <WebView
                source={{ uri: getYoutubeEmbedUrl(playingItem.youtubeId) }}
                style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH * 9) / 16 }}
                allowsFullscreenVideo
                javaScriptEnabled
                mediaPlaybackRequiresUserAction={false}
              />
            ) : (
              <View
                style={{
                  width: SCREEN_WIDTH,
                  height: (SCREEN_WIDTH * 9) / 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DescriptionLine>재생할 수 없는 콘텐츠입니다.</DescriptionLine>
              </View>
            )}

            {/* 하단 정지 버튼 */}
            <View
              style={{
                padding: 16,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={handleStop}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons
                  name="stop-circle"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <YoutubeModalTitle style={{ flex: 0 }}>정지</YoutubeModalTitle>
              </TouchableOpacity>
            </View>
          </YoutubeModalContent>
        </YoutubeModalOverlay>
      </Modal>
    </Screen>
  );
};

export default SleepHelpListScreen;
