import React, { useState } from "react";
import styled from "styled-components/native";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import Header from "../../shared/components/common/Header";
import { theme } from "../../shared/theme/theme";

type SleepHelpListRouteProp = RouteProp<CareStackParamList, "SleepHelpList">;
type NavigationProp = NativeStackNavigationProp<
  CareStackParamList,
  "SleepHelpList"
>;

const Screen = styled.SafeAreaView`
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
      : ""}
`;

const ListContainer = styled.View`
  flex: 1;
  padding-vertical: 24px;
  padding-horizontal: 16px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const ItemContainer = styled.TouchableOpacity`
  width: 48%;
  margin-bottom: 20px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  align-items: flex-start;
`;

const ItemImageContainer = styled.View<{ hasPlayButton?: boolean }>`
  width: 168px;
  height: 120px;
  position: relative;
  border-width: 1px;
  border-color: ${({ hasPlayButton, theme }) =>
    hasPlayButton ? theme.colors.primary : theme.colors.gray700};
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
`;

const ItemContent = styled.View`
  width: 100%;
  padding-top: 8px;
`;

const ItemTitle = styled.Text<{ hasPlayButton?: boolean }>`
  font-size: 18px;
  color: ${({ theme, hasPlayButton }) =>
    hasPlayButton ? theme.colors.primary : theme.colors.text};
  text-align: left;
`;

const SleepHelpListScreen = () => {
  const route = useRoute<SleepHelpListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const initialCategory = route.params?.category || "소리";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = ["소리", "음악", "호흡", "스트레칭"];

  // 임시 데이터 - 실제 API에서 가져와야 함
  const items = [
    {
      id: "1",
      image: require("../../../assets/image/sing.png"),
      title: "싱잉볼 테라피",
      hasPlayButton: true,
    },
    {
      id: "2",
      image: require("../../../assets/image/fire.png"),
      title: "장작 소리",
    },
    {
      id: "3",
      image: require("../../../assets/image/sing.png"),
      title: "싱잉볼 테라피",
    },
    {
      id: "4",
      image: require("../../../assets/image/fire.png"),
      title: "장작 소리",
    },
    {
      id: "5",
      image: require("../../../assets/image/sing.png"),
      title: "싱잉볼 테라피",
    },
    {
      id: "6",
      image: require("../../../assets/image/fire.png"),
      title: "장작 소리",
    },
  ];

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
            data={items}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <ItemContainer
                onPress={() => {
                  // 아이템 상세 화면으로 이동
                }}
                activeOpacity={1}
              >
                <ItemImageContainer hasPlayButton={item.hasPlayButton}>
                  {item.image ? (
                    <ItemImage source={item.image} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                  {item.hasPlayButton && (
                    <PlayButtonOverlay>
                      <Ionicons
                        name="play"
                        size={32}
                        color={theme.colors.primary}
                      />
                    </PlayButtonOverlay>
                  )}
                </ItemImageContainer>
                <ItemContent>
                  <ItemTitle hasPlayButton={item.hasPlayButton}>
                    {item.title}
                  </ItemTitle>
                </ItemContent>
              </ItemContainer>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </ListContainer>
      </Content>
    </Screen>
  );
};

export default SleepHelpListScreen;
