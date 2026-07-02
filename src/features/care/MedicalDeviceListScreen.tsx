import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "../../shared/components/common/SafeAreaView";
import {
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "../../shared/components/common/Header";
import Controller from "../../services/controller";
import { getMemberId } from "../../services/authService";
import Button from "../../shared/components/common/Button";
import { useTheme } from "styled-components/native";

const Screen = styled(SafeAreaView)`
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

const CareImage = styled(Image)`
  width: 100%;
  height: 200px;
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
  margin-top: 8px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
`;

// =====================
// 모달 Styled Components
// =====================

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const OverlayTouchable = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 8px;
`;

const ModalDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
  line-height: 24px;
`;

const FieldLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const InputField = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 14px 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

const TextAreaField = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 14px 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  height: 140px;
  text-align-vertical: top;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

// =====================
// Component
// =====================

const MedicalDeviceListScreen = () => {
  const theme = useTheme();

  const [products, setProducts] = useState<any[]>([]);
  const [careBannerImage, setCareBannerImage] = useState<string | undefined>(
    undefined,
  );
  const [isConsultModalVisible, setIsConsultModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCareBanner();
  }, []);

  const fetchProducts = async () => {
    const controller = new Controller({
      modelName: "CareDevice",
      modelId: "care_device",
    });
    const response = await controller.findAll({ IS_EXPOSED: "Y" });
    if (response?.status === 200) {
      const rows = response.result?.rows ?? response.result ?? [];
      setProducts(rows);
    }
  };

  const fetchCareBanner = async () => {
    const controller = new Controller({
      modelName: "CareBanner",
      modelId: "care_banner",
    });
    const response = await controller.findAll({});
    if (response?.status === 200 && response.result.rows.length > 0) {
      setCareBannerImage(JSON.parse(response.result.rows[0].IMAGE_URL)[0]);
    }
  };

  const handleConsultSubmit = async () => {
    if (!phoneNumber.trim()) {
      alert("연락 받으실 전화번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const memberId = await getMemberId();

      const controller = new Controller({
        modelName: "ProductConsult",
        modelId: "product_consult",
      });

      await controller.create({
        APP_MEMBER_IDENTIFICATION_CODE: memberId,
        PHONE_NUMBER: phoneNumber.trim(),
        MESSAGE: message.trim(),
      });

      //alert("상담 신청이 완료되었습니다.");
      handleConsultClose();
    } catch (error) {
      console.error("상담 신청 실패:", error);
      //alert("상담 신청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultClose = () => {
    setPhoneNumber("");
    setMessage("");
    setIsConsultModalVisible(false);
  };

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
                Linking.openURL("https://worldhome.co.kr/");
              }}
              activeOpacity={1}
            >
              <ActionButtonText variant="primary">
                공식몰 바로가기
              </ActionButtonText>
            </ActionButton>
            <ActionButton
              variant="secondary"
              onPress={() => setIsConsultModalVisible(true)}
              activeOpacity={1}
            >
              <ActionButtonText variant="secondary">
                제품 상담 신청
              </ActionButtonText>
            </ActionButton>
          </ActionButtonsContainer>

          <CareImage source={{ uri: careBannerImage }} resizeMode="contain" />

          <ProductCategorySection>
            <ProductCategoryTitle>제품 종류</ProductCategoryTitle>
            <ProductCategoryDescription>
              공식몰에서 제품 당 상세정보와 효능을{"\n"} 확인 하실 수 있습니다.
            </ProductCategoryDescription>
            <ProductGrid>
              {products.map((product) => {
                let imageUrl = null;
                if (product.IMAGE_URL) {
                  try {
                    imageUrl = JSON.parse(product.IMAGE_URL)[0];
                  } catch {
                    imageUrl = product.IMAGE_URL;
                  }
                }
                return (
                  <ProductCard
                    key={product.CARE_DEVICE_IDENTIFICATION_CODE}
                    onPress={() => {
                      if (product.PRODUCT_LINK) {
                        Linking.openURL(product.PRODUCT_LINK);
                      } else {
                        Linking.openURL("https://worldhome.co.kr/");
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <ProductCardImageContainer>
                      {imageUrl ? (
                        <ProductCardImage
                          source={{ uri: imageUrl }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ flex: 1 }} />
                      )}
                    </ProductCardImageContainer>
                    <ProductCardTitle>{product.NAME}</ProductCardTitle>
                  </ProductCard>
                );
              })}
            </ProductGrid>
          </ProductCategorySection>
        </Content>
      </ScrollableContent>

      {/* 제품 상담 신청 모달 */}
      <Modal
        visible={isConsultModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleConsultClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ModalOverlay>
            <OverlayTouchable activeOpacity={1} onPress={handleConsultClose} />
            <ModalCard>
              <ModalTitle>제품 상담 신청</ModalTitle>
              <ModalDescription>
                전문 상담원이 직접 상담을 도와드립니다.
              </ModalDescription>

              <FieldLabel>연락 받으실 전화번호</FieldLabel>
              <InputField
                placeholder="휴대폰 번호"
                placeholderTextColor={theme.colors.gray400}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              <FieldLabel>남기실 말씀</FieldLabel>
              <TextAreaField
                placeholder={`관심있는 의료기기 또는 상담 내용을 간단하게\n작성해주시면 상담에 도움이 됩니다.`}
                placeholderTextColor={theme.colors.gray400}
                value={message}
                onChangeText={setMessage}
                multiline
              />

              <ButtonRow>
                <Button
                  variant="ghost"
                  onPress={handleConsultClose}
                  style={{ flex: 1 }}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  onPress={handleConsultSubmit}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? "신청 중..." : "신청"}
                </Button>
              </ButtonRow>
            </ModalCard>
          </ModalOverlay>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
};

export default MedicalDeviceListScreen;
