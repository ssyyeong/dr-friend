import React, { useEffect, useRef, useState, useCallback } from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../shared/components/common/Header";
import { Modal, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import AppMemberController from "../../../services/AppMemberController";
import Controller from "../../../services/controller";
import { getMemberId } from "../../../services/authService";

type SettingScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Setting"
>;

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const AccountCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AccountEmail = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const InputContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  padding: 20px;
`;

const InputField = styled.TouchableOpacity<{ isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ isLast }) => (isLast ? 0 : 16)}px;
`;

const InputLabel = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
`;

const InputValueContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray600};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const InputValue = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 4px;
`;

const ProductCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProductLeft = styled.View`
  flex: 1;
`;

const ProductLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ProductValue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray300};
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.gray800};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 20px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

const PickerContainer = styled.View`
  height: 200px;
  position: relative;
`;

const PickerScrollViewContainer = styled.View`
  height: 200px;
  width: 100%;
`;

const PickerItem = styled.View<{ isSelected: boolean }>`
  height: 50px;
  justify-content: center;
  align-items: center;
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.4)};
`;

const PickerItemText = styled.Text<{ isSelected: boolean }>`
  font-size: 24px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.text : theme.colors.gray400};
`;

const PickerSelectionIndicator = styled.View`
  position: absolute;
  top: 75px;
  left: 0;
  right: 0;
  height: 50px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: rgba(115, 83, 255, 0.3);
  pointer-events: none;
`;

const ModalButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 24px;
`;

const ModalButtonWrapper = styled.View`
  flex: 1;
  margin-right: 12px;
`;

const ModalButtonWrapperLast = styled.View`
  flex: 1;
`;

const ModalTextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.gray400,
}))`
  height: 52px;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 17px;
  margin-bottom: 24px;
`;

const SettingScreen: React.FC = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const theme = useTheme();

  const genderOptions = ["남성", "여성"];
  const ITEM_HEIGHT = 50;
  const PICKER_HEIGHT = 200;

  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("남성");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [productStatus, setProductStatus] = useState<string>("");
  const [productList, setProductList] = useState<string[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [currentModal, setCurrentModal] = useState<
    "gender" | "weight" | "height" | "birthday" | null
  >(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const modalInputRef = useRef<TextInput>(null);
  const genderScrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        const fetchedMemberId = await getMemberId();
        if (!fetchedMemberId) {
          return;
        }
        setMemberId(fetchedMemberId);

        const controller = new Controller({
          modelName: "AppMember",
          modelId: "app_member",
        });
        const response = await controller.findOne({
          APP_MEMBER_IDENTIFICATION_CODE: fetchedMemberId,
        });
        if (response?.status === 200) {
          const user = response.result;
          // 이메일
          if (user.USER_NAME) {
            setEmail(user.USER_NAME);
          }

          // 성별 (M -> 남성, F -> 여성)
          if (user.GENDER) {
            setGender(user.GENDER === "M" ? "남성" : "여성");
          }

          // 체중
          if (user.WEIGHT) {
            setWeight(user.WEIGHT.toString());
          }

          // 신장
          if (user.HEIGHT) {
            setHeight(user.HEIGHT.toString());
          }

          // 생일
          if (user.BIRTH) {
            setBirthday(user.BIRTH);
          }

          //제품 보유 상태
          if (user.PRODUCT_STATUS) {
            setProductStatus(user.PRODUCT_STATUS);
            if (user.PRODUCT_STATUS === "HAS") {
              setProductList(JSON.parse(user.PRODUCT_LIST));
            }
          }
        }
      };
      fetchUserInfo();
    }, [])
  );

  const openModal = (type: "gender" | "weight" | "height" | "birthday") => {
    setCurrentModal(type);
    if (type === "gender") {
      setTempValue(gender);
      // 성별 피커의 경우 현재 선택된 값으로 스크롤 위치 설정
      setTimeout(() => {
        const selectedIndex = genderOptions.indexOf(gender);
        if (selectedIndex >= 0 && genderScrollRef.current) {
          genderScrollRef.current.scrollTo({
            y: selectedIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
      }, 100);
    } else if (type === "weight") {
      setTempValue(weight);
    } else if (type === "height") {
      setTempValue(height);
    } else if (type === "birthday") {
      setTempValue(birthday);
    }
    setModalVisible(true);
    // 텍스트 입력 모달의 경우 포커스
    if (type !== "gender") {
      setTimeout(() => modalInputRef.current?.focus(), 100);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
    setTempValue("");
  };

  const handleGenderScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < genderOptions.length) {
      setTempValue(genderOptions[index]);
    }
  };

  const handleGenderScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const targetIndex = Math.max(0, Math.min(index, genderOptions.length - 1));

    if (genderScrollRef.current) {
      genderScrollRef.current.scrollTo({
        y: targetIndex * ITEM_HEIGHT,
        animated: true,
      });
    }

    setTempValue(genderOptions[targetIndex]);
  };

  const getModalTitle = () => {
    if (currentModal === "gender") return "성별";
    if (currentModal === "weight") return "체중";
    if (currentModal === "height") return "신장";
    if (currentModal === "birthday") return "생일";
    return "";
  };

  const getPlaceholder = () => {
    if (currentModal === "weight") return "체중을 입력하세요 (kg)";
    if (currentModal === "height") return "신장을 입력하세요 (cm)";
    if (currentModal === "birthday") return "생일을 입력하세요 (YYYY-MM-DD)";
    return "";
  };

  const renderModalContent = () => {
    if (!currentModal) return null;

    if (currentModal === "gender") {
      return (
        <>
          <ModalHeader>
            <ModalTitle>성별</ModalTitle>
            <CloseButton onPress={closeModal}>
              <Ionicons name="close" size={24} color="#F2F5FA" />
            </CloseButton>
          </ModalHeader>
          <PickerContainer>
            <PickerSelectionIndicator />
            <PickerScrollViewContainer>
              <ScrollView
                ref={genderScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScroll={handleGenderScroll}
                onMomentumScrollEnd={handleGenderScrollEnd}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
                contentContainerStyle={{
                  paddingTop: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
                  paddingBottom: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
                }}
                style={{ flex: 1 }}
              >
                {genderOptions.map((option, index) => (
                  <PickerItem
                    key={option}
                    isSelected={tempValue === option}
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <PickerItemText isSelected={tempValue === option}>
                      {option}
                    </PickerItemText>
                  </PickerItem>
                ))}
              </ScrollView>
            </PickerScrollViewContainer>
          </PickerContainer>
        </>
      );
    }

    // 체중, 신장, 생일은 텍스트 입력
    return (
      <>
        <ModalHeader>
          <ModalTitle>{getModalTitle()}</ModalTitle>
          <CloseButton onPress={closeModal}>
            <Ionicons name="close" size={24} color="#F2F5FA" />
          </CloseButton>
        </ModalHeader>
        <ModalTextInput
          ref={modalInputRef}
          value={tempValue}
          onChangeText={setTempValue}
          placeholder={getPlaceholder()}
          keyboardType={currentModal === "birthday" ? "default" : "numeric"}
        />
      </>
    );
  };

  const handleSave = async () => {
    if (currentModal === "gender") {
      setGender(tempValue);
    } else if (currentModal === "weight") {
      setWeight(tempValue);
    } else if (currentModal === "height") {
      setHeight(tempValue);
    } else if (currentModal === "birthday") {
      setBirthday(tempValue);
    }
    closeModal();
  };

  const handleSaveAll = async () => {
    if (!memberId) {
      return;
    }

    const controller = new Controller({
      modelName: "AppMember",
      modelId: "app_member",
    });

    const updateData: any = {
      APP_MEMBER_IDENTIFICATION_CODE: memberId,
    };

    // 성별 변환 (남성 -> M, 여성 -> F)
    if (gender) {
      updateData.GENDER = gender === "남성" ? "M" : "F";
    }

    // 체중, 신장, 생일
    if (weight) {
      updateData.WEIGHT = parseFloat(weight) || 0;
    }
    if (height) {
      updateData.HEIGHT = parseFloat(height) || 0;
    }
    if (birthday) {
      updateData.BIRTH = birthday;
    }

    try {
      const response = await controller.update(updateData);
      console.log("업데이트 성공:", response);
      if (response?.status === 200) {
        navigation.goBack();
      }
      // TODO: 성공 메시지 표시
    } catch (error) {
      console.error("업데이트 실패:", error);
      // TODO: 에러 메시지 표시
    }
  };

  return (
    <Screen>
      <Header
        title="내 정보"
        showBackButton={true}
        rightButton={{
          text: "저장",
          onPress: handleSaveAll,
        }}
      />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          {/* 계정 섹션 */}
          <Section>
            <SectionTitle>계정</SectionTitle>
            <AccountCard activeOpacity={1}>
              <AccountEmail>{email || "이메일 없음"}</AccountEmail>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.gray100}
              />
            </AccountCard>
          </Section>

          {/* 추가정보 섹션 */}
          <Section>
            <SectionTitle>추가정보</SectionTitle>
            <InputContainer>
              <InputField onPress={() => openModal("gender")}>
                <InputLabel>성별</InputLabel>
                <InputValueContainer>
                  <InputValue>{gender || "선택"}</InputValue>
                  <Ionicons name="chevron-down" size={16} color="#E0E9F4" />
                </InputValueContainer>
              </InputField>

              <InputField onPress={() => openModal("weight")}>
                <InputLabel>체중</InputLabel>
                <InputValueContainer>
                  <InputValue>{weight ? `${weight}kg` : "선택"}</InputValue>
                  <Ionicons name="chevron-down" size={16} color="#E0E9F4" />
                </InputValueContainer>
              </InputField>

              <InputField onPress={() => openModal("height")}>
                <InputLabel>신장</InputLabel>
                <InputValueContainer>
                  <InputValue>{height ? `${height}cm` : "선택"}</InputValue>
                  <Ionicons name="chevron-down" size={16} color="#E0E9F4" />
                </InputValueContainer>
              </InputField>

              <InputField onPress={() => openModal("birthday")} isLast>
                <InputLabel>생일</InputLabel>
                <InputValueContainer>
                  <InputValue>{birthday || "선택"}</InputValue>
                  <Ionicons name="chevron-down" size={16} color="#E0E9F4" />
                </InputValueContainer>
              </InputField>
            </InputContainer>
          </Section>

          {/* 나의 닥터프렌드 제품 섹션 */}
          <Section>
            <SectionTitle>나의 닥터프렌드 제품</SectionTitle>
            <ProductCard
              activeOpacity={1}
              onPress={() =>
                productStatus === "HAS" && navigation.navigate("ProductSelect")
              }
            >
              <ProductLeft>
                <ProductLabel>
                  {productStatus === "HAS"
                    ? "제품 보유중"
                    : productStatus === "Y"
                    ? "구매 계획 있음"
                    : "구매 계획 없음"}
                </ProductLabel>
                <ProductValue>
                  {productStatus === "HAS" &&
                    productList.map((product) => product).join(", ")}
                  {productList.length > 0
                    ? "외 " + (productList.length - 1)
                    : ""}
                </ProductValue>
              </ProductLeft>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.gray50}
              />
            </ProductCard>
          </Section>
        </Content>
      </ScrollableContent>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={{ flex: 1 }}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <ModalContent>
            {renderModalContent()}
            <ModalButtonContainer>
              <ModalButtonWrapper>
                <Button variant="ghost" onPress={closeModal}>
                  취소
                </Button>
              </ModalButtonWrapper>
              <ModalButtonWrapperLast>
                <Button
                  variant="primary"
                  onPress={handleSave}
                  disabled={
                    currentModal === "gender" ? !tempValue : !tempValue.trim()
                  }
                >
                  저장
                </Button>
              </ModalButtonWrapperLast>
            </ModalButtonContainer>
          </ModalContent>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
};

export default SettingScreen;
