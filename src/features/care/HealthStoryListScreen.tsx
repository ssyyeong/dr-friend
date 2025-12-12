import React, { useState } from "react";
import styled from "styled-components/native";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import Header from "../../shared/components/common/Header";
import { theme } from "../../shared/theme/theme";

type HealthStoryListRouteProp = RouteProp<
  CareStackParamList,
  "HealthStoryList"
>;
type NavigationProp = NativeStackNavigationProp<
  CareStackParamList,
  "HealthStoryList"
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

const HealthStoryListScreen = () => {
  const route = useRoute<HealthStoryListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState("수면");

  const categories = ["수면", "건강", "후기", "Dr.Friend"];

  // 임시 데이터 - 실제 API에서 가져와야 함
  const items = [
    {
      id: "1",
      image: require("../../../assets/image/sing.png"),
      title: "그라운딩, 어싱 이란?",
    },
    {
      id: "2",
      image: require("../../../assets/image/fire.png"),
      title: "꿀잠, 꿀팁",
    },
    {
      id: "3",
      image: require("../../../assets/image/sing.png"),
      title: "그라운딩, 어싱 이란?",
    },
    {
      id: "4",
      image: require("../../../assets/image/fire.png"),
      title: "건강한 수면 습관 만들기",
    },
    {
      id: "5",
      image: require("../../../assets/image/sing.png"),
      title: "스트레스 해소 방법",
    },
    {
      id: "6",
      image: require("../../../assets/image/fire.png"),
      title: "명상과 마음챙김",
    },
  ];

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
              activeOpacity={0.7}
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemContainer
                onPress={() => {
                  // 아이템 상세 화면으로 이동
                }}
                activeOpacity={0.8}
              >
                <ItemImageContainer>
                  {item.image ? (
                    <ItemImage source={item.image} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                </ItemImageContainer>
                <ItemContent>
                  <ItemTitle>{item.title}</ItemTitle>
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

export default HealthStoryListScreen;
