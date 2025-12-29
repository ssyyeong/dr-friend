import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import ProgressIndicator from "./ProgressIndicator";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../shared/theme/theme";
type Props = NativeStackScreenProps<AuthStackParamList, "InfoStep3">;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
  padding: 24px 16px;
`;

const Content = styled.View`
  flex: 1;
  width: 100%;
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.22px;
  line-height: 35.2px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 36px;
`;

const OptionItem = styled.TouchableOpacity<{
  selected?: boolean;
  isLast?: boolean;
  selectedType?: "owned" | "plan" | "noPlan";
}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: ${({ selected, theme }) =>
    selected ? "rgba(115,83, 255, 0.20)" : "rgba(79, 107, 145, 0.24)"};
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : "transparent"};
  border-width: ${({ selected }) => (selected ? 1 : 0)}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: ${({ isLast, selectedType }) =>
    isLast ? 0 : selectedType === "owned" ? 0 : 12}px;
`;

const OptionText = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
`;

const ProductListContainer = styled.View`
  padding: 16px;
`;

const ProductItem = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.text : theme.colors.gray700};
`;

const ProductText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const SetLaterLink = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: 5px;
`;

const SetLaterText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  text-decoration-line: underline;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: transparent;
`;

const InfoStep3Screen: React.FC<Props> = ({ route, navigation }) => {
  const [selectedType, setSelectedType] = useState<
    "owned" | "plan" | "noPlan" | null
  >(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const products = [
    "어싱 닥터프렌드",
    "뉴슬립패드",
    "그라운딩 쿠션",
    "수면 분석 손목밴드",
  ];

  const handleTypeSelect = (type: "owned" | "plan" | "noPlan") => {
    if (selectedType === type) {
      setSelectedType(null);
      if (type === "owned") {
        setSelectedProducts([]);
      }
    } else {
      setSelectedType(type);
      if (type !== "owned") {
        setSelectedProducts([]);
      }
    }
  };

  const toggleProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((item) => item !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleSetLater = () => {
    navigation.navigate("InfoStep4", {
      id: route.params.id,
      step1Data: route.params.step1Data,
      step2Data: route.params.step2Data,
      step3Data: {
        type: selectedType,
        products: selectedType === "owned" ? selectedProducts : [],
      },
    });
  };

  const handleNext = () => {
    if (selectedType) {
      const step3Data = {
        type: selectedType,
        products: selectedType === "owned" ? selectedProducts : [],
      };
      // TODO: 실제 다음 단계로 이동하도록 변경 필요
      navigation.navigate("InfoStep4", {
        id: route.params.id,
        step1Data: route.params.step1Data,
        step2Data: route.params.step2Data,
        step3Data,
      });
    }
  };

  const canProceed = () => {
    if (selectedType === "owned") {
      return selectedProducts.length > 0;
    }
    return selectedType !== null;
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <ProgressIndicator currentStep={3} />

          <ScrollableContent showsVerticalScrollIndicator={false}>
            <Title>
              보유 중인 닥터프렌드{"\n"}제품을 선택해주세요.{"\n"}
              (없으신 경우 구매 계획 여부를 선택)
            </Title>
            <OptionItem
              selected={selectedType === "owned"}
              onPress={() => handleTypeSelect("owned")}
            >
              <OptionText>제품 보유 중 (선택)</OptionText>
              <Ionicons
                name="checkmark"
                size={20}
                color={
                  selectedType === "owned"
                    ? theme.colors.primary
                    : theme.colors.gray500
                }
              />
            </OptionItem>

            {selectedType === "owned" && (
              <ProductListContainer>
                {products.map((product) => (
                  <ProductItem
                    key={product}
                    selected={selectedProducts.includes(product)}
                    onPress={() => toggleProduct(product)}
                  >
                    <ProductText>{product}</ProductText>
                    {selectedProducts.includes(product) && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.text}
                      />
                    )}
                  </ProductItem>
                ))}
              </ProductListContainer>
            )}

            <OptionItem
              selected={selectedType === "plan"}
              onPress={() => handleTypeSelect("plan")}
            >
              <OptionText>구매 계획 있음</OptionText>
              <Ionicons
                name="checkmark"
                size={20}
                color={
                  selectedType === "plan"
                    ? theme.colors.primary
                    : theme.colors.gray500
                }
              />
            </OptionItem>

            <OptionItem
              selected={selectedType === "noPlan"}
              onPress={() => handleTypeSelect("noPlan")}
              isLast
            >
              <OptionText>구매 계획 없음</OptionText>
              <Ionicons
                name="checkmark"
                size={20}
                color={
                  selectedType === "noPlan"
                    ? theme.colors.primary
                    : theme.colors.gray500
                }
              />
            </OptionItem>
          </ScrollableContent>
        </Content>

        <ButtonContainer>
          <SetLaterLink onPress={handleSetLater}>
            <SetLaterText>나중에 설정</SetLaterText>
          </SetLaterLink>
          <Button
            variant="primary"
            onPress={handleNext}
            disabled={!canProceed()}
          >
            다음
          </Button>
        </ButtonContainer>
      </Screen>
    </GradientBackground>
  );
};

export default InfoStep3Screen;
