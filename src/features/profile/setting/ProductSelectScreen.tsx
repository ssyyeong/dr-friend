import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "../../../shared/components/common/SafeAreaView";
import Header from "../../../shared/components/common/Header";
import Controller from "../../../services/controller";
import { getMemberId } from "../../../services/authService";
import { useNavigation } from "@react-navigation/native";
const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const InnerContent = styled.View`
  padding: 24px 16px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const ProductList = styled.View`
  gap: 8px;
`;

interface ProductItemProps {
  isSelected: boolean;
}

const ProductItem = styled.TouchableOpacity<ProductItemProps>`
  border-width: 1px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.text : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 14px 18px;
  background-color: transparent;
`;

const ProductText = styled.Text<ProductItemProps>`
  font-size: 16px;
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.text : theme.colors.gray200};
`;

const products = [
  "어싱 닥터프렌드",
  "뉴슬립패드",
  "그라운딩 쿠션",
  "수면 분석 손목밴드",
];

const ProductSelectScreen = () => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [memberId, setMemberId] = useState<number | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadProductList = async () => {
      try {
        const id = await getMemberId();
        setMemberId(Number(id));

        const controller = new Controller({
          modelName: "AppMember",
          modelId: "app_member",
        });

        const response = await controller.findOne({
          APP_MEMBER_IDENTIFICATION_CODE: id,
        });

        if (response?.status === 200 && response?.result) {
          const productList = response.result.PRODUCT_LIST;
          if (productList) {
            const parsed: string[] =
              typeof productList === "string"
                ? JSON.parse(productList)
                : productList;
            setSelectedProducts(new Set(parsed));
          }
        }
      } catch (error) {
        console.error("제품 목록 불러오기 실패:", error);
      }
    };

    loadProductList();
  }, []);

  const handleProductToggle = (product: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(product)) {
        newSet.delete(product);
      } else {
        newSet.add(product);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      const controller = new Controller({
        modelName: "AppMember",
        modelId: "app_member",
      });

      await controller
        .update({
          APP_MEMBER_IDENTIFICATION_CODE: memberId,
          PRODUCT_STATUS: selectedProducts.size > 0 ? "Y" : "N",
          PRODUCT_LIST: JSON.stringify(Array.from(selectedProducts)),
        })
        .then((response) => {
          if (response?.status === 200) {
            navigation.goBack();
          }
        });
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };

  return (
    <Screen>
      <Header
        title="나의 닥터프렌드 제품 상세"
        rightButton={{
          text: "저장",
          onPress: handleSave,
        }}
      />
      <Content showsVerticalScrollIndicator={false}>
        <InnerContent>
          <SectionTitle>보유 제품 정보</SectionTitle>
          <ProductList>
            {products.map((product) => {
              const isSelected = selectedProducts.has(product);
              return (
                <ProductItem
                  key={product}
                  isSelected={isSelected}
                  activeOpacity={1}
                  onPress={() => handleProductToggle(product)}
                >
                  <ProductText isSelected={isSelected}>{product}</ProductText>
                </ProductItem>
              );
            })}
          </ProductList>
        </InnerContent>
      </Content>
    </Screen>
  );
};

export default ProductSelectScreen;
