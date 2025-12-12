import React, { useState } from "react";
import styled from "styled-components/native";
import {
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import Header from "../../shared/components/common/Header";

type NavigationProp = NativeStackNavigationProp<
  CareStackParamList,
  "MedicalDeviceList"
>;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled(ScrollView)`
  flex: 1;
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
  margin-bottom: 12px;
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 24px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  padding: 0 16px;
  margin-bottom: 52px;
  gap: 12px;
`;

const ActionButton = styled(TouchableOpacity)<{
  variant: "primary" | "secondary";
}>`
  flex: 1;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.primary : theme.colors.text};
`;

const ActionButtonText = styled.Text<{ variant: "primary" | "secondary" }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ variant, theme }) =>
    variant === "primary" ? theme.colors.text : theme.colors.primary};
`;

const ProductDetailSection = styled.View`
  overflow: hidden;
`;

const ProductDetailImage = styled(Image)`
  width: 100%;
`;

const MoreButton = styled(TouchableOpacity)`
  align-items: center;
  padding: 16px;
  margin-bottom: 24px;
`;

const MoreButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const ProductCategorySection = styled.View`
  background-color: ${({ theme }) => theme.colors.gray800};
  padding: 56px 16px 40px 16px;
`;

const ProductCategoryTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const ProductCategoryDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 25.6px;
  margin-bottom: 24px;
`;

const ProductGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ProductCard = styled(TouchableOpacity)`
  width: ${(Dimensions.get("window").width - 48) / 2}px;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray800};
`;

const ProductCardImageContainer = styled.View`
  width: 168px;
  height: 120px;
  overflow: hidden;
`;

const ProductCardImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ProductCardTitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
`;

const MedicalDeviceListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showMore, setShowMore] = useState(false);

  // 임시 데이터 - 실제 API에서 가져와야 함
  const products = [
    {
      id: "1",
      image: null,
      title: "어싱 닥터프렌드 (매트)",
    },
    {
      id: "2",
      image: null,
      title: "뉴슬립패드",
    },
    {
      id: "3",
      image: null,
      title: "어싱 닥터프렌드 (매트)",
    },
    {
      id: "4",
      image: null,
      title: "뉴슬립패드",
    },
  ];

  return (
    <Screen>
      <Header title="" />
      <ScrollableContent>
        <Content>
          <DescriptionContainer>
            <DescriptionTitle>수면 의료기기</DescriptionTitle>
            <DescriptionText>
              닥터프렌드 제품과 함께하는 {"\n"}체계적인 수면 케어를 제공합니다.
            </DescriptionText>
          </DescriptionContainer>

          <ActionButtonsContainer>
            <ActionButton
              variant="primary"
              onPress={() => {
                // 공식몰 바로가기
              }}
              activeOpacity={0.8}
            >
              <ActionButtonText variant="primary">
                공식몰 바로가기
              </ActionButtonText>
            </ActionButton>
            <ActionButton
              variant="secondary"
              onPress={() => {
                // 제품 상담 신청
              }}
              activeOpacity={0.8}
            >
              <ActionButtonText variant="secondary">
                제품 상담 신청
              </ActionButtonText>
            </ActionButton>
          </ActionButtonsContainer>

          <ProductDetailSection>
            <ProductDetailImage
              source={require("../../../assets/image/product.png")}
              resizeMode="cover"
            />
          </ProductDetailSection>

          {/* <MoreButton
            onPress={() => setShowMore(!showMore)}
            activeOpacity={0.7}
          >
            <MoreButtonText>더보기</MoreButtonText>
          </MoreButton> */}

          <ProductCategorySection>
            <ProductCategoryTitle>제품 종류</ProductCategoryTitle>
            <ProductCategoryDescription>
              공식몰에서 제품 당 상세정보와 효능을{"\n"} 확인 하실 수 있습니다.
            </ProductCategoryDescription>
            <ProductGrid>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  onPress={() => {
                    // 제품 상세 화면으로 이동
                  }}
                  activeOpacity={0.8}
                >
                  <ProductCardImageContainer>
                    {product.image ? (
                      <ProductCardImage
                        source={product.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}
                  </ProductCardImageContainer>
                  <ProductCardTitle>{product.title}</ProductCardTitle>
                </ProductCard>
              ))}
            </ProductGrid>
          </ProductCategorySection>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default MedicalDeviceListScreen;
