import React, { useState } from "react";
import styled from "styled-components/native";
import Header from "../../../shared/components/common/Header";

const Screen = styled.SafeAreaView`
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

const ProductSelectScreen = () => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(["어싱 닥터프렌드", "뉴슬립패드"])
  );

  const products = [
    "어싱 닥터프렌드",
    "뉴슬립패드",
    "그라운딩 쿠션",
    "수면 분석 손목밴드",
  ];

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

  const handleSave = () => {
    // 저장 로직 구현
    console.log("선택된 제품:", Array.from(selectedProducts));
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
