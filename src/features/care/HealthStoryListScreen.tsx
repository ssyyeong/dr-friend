import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components/native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import Header from "../../shared/components/common/Header";
import Controller from "../../services/controller";

type HealthStoryListRouteProp = RouteProp<
  CareStackParamList,
  "HealthStoryList"
>;
type NavigationProp = NativeStackNavigationProp<
  CareStackParamList,
  "HealthStoryList"
>;

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

const ItemContainer = styled.TouchableOpacity`
  width: 100%;
  margin-bottom: 20px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  align-items: flex-start;
`;

const ItemImageContainer = styled.View`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

const ItemImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ItemContent = styled.View`
  width: 100%;
  padding-top: 8px;
`;

const ItemTitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
`;

const ItemCategory = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 4px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
  margin-top: 40px;
`;

const HealthStoryListScreen = () => {
  const route = useRoute<HealthStoryListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState("수면");
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["수면", "건강", "후기", "Dr.Friend"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const controller = new Controller({
          modelName: "HealthStoryContent",
          modelId: "health_story_content",
        });
        const response = await controller.findAll({ IS_EXPOSED: "Y" });
        if (response?.status === 200) {
          const rows = response.result?.rows ?? response.result ?? [];
          setAllItems(
            rows.map((item: any) => ({
              id: String(item.HEALTH_STORY_CONTENT_IDENTIFICATION_CODE),
              image: item.THUMBNAIL_IMAGE_URL
                ? { uri: JSON.parse(item.THUMBNAIL_IMAGE_URL)[0] }
                : null,
              title: item.TITLE,
              category: item.CATEGORY,
              content: item.CONTENT,
            })),
          );
        }
      } catch (e) {
        console.error("건강 이야기 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // ✅ 카테고리 필터링 (DB 카테고리가 "Dr. Friend"이므로 탭과 맞춤)
  const filteredItems = allItems.filter((item) => {
    if (selectedCategory === "Dr.Friend") return item.category === "Dr. Friend";
    return item.category === selectedCategory;
  });

  return (
    <Screen>
      <Header title="" />
      <Content>
        <DescriptionContainer>
          <DescriptionTitle>건강 이야기</DescriptionTitle>
          <DescriptionLine>수면과 건강에 대한 올바른 정보와</DescriptionLine>
          <DescriptionLine>다양한 이야기를 만나보세요.</DescriptionLine>
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemContainer
                onPress={() => {
                  // 상세 화면으로 이동 (추후 연동)
                }}
                activeOpacity={0.8}
              >
                <ItemImageContainer>
                  {item.image ? (
                    <ItemImage source={item.image} resizeMode="cover" />
                  ) : (
                    <View
                      style={{ flex: 1, backgroundColor: theme.colors.gray600 }}
                    />
                  )}
                </ItemImageContainer>
                <ItemContent>
                  <ItemCategory>{item.category}</ItemCategory>
                  <ItemTitle>{item.title}</ItemTitle>
                </ItemContent>
              </ItemContainer>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              loading ? null : <EmptyText>콘텐츠가 없습니다.</EmptyText>
            }
          />
        </ListContainer>
      </Content>
    </Screen>
  );
};

export default HealthStoryListScreen;
