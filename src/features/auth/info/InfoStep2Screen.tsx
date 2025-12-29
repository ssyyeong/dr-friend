import React, { useState, useRef } from "react";
import {
  Modal,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import ProgressIndicator from "./ProgressIndicator";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<AuthStackParamList, "InfoStep2">;

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

const InputContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 36px;
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

const GenderButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
`;

const GenderButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  height: 52px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? "rgba(115, 83, 255, 0.20)" : theme.colors.gray600};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: ${({ isSelected }) => (isSelected ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const GenderButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: 17px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.text : theme.colors.gray300};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: transparent;
`;

// Bottom Sheet Modal Styles
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
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
  flex: 1;
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

const InfoStep2Screen: React.FC<Props> = ({ route, navigation }) => {
  const [gender, setGender] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<
    "gender" | "weight" | "height" | "birthday" | null
  >(null);
  const [tempValue, setTempValue] = useState<string>("");

  const modalInputRef = useRef<RNTextInput>(null);

  const openModal = (type: "gender" | "weight" | "height" | "birthday") => {
    setCurrentModal(type);
    if (type === "gender") {
      setTempValue(gender);
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

  const handleSave = () => {
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

  const handleNext = () => {
    navigation.navigate("InfoStep3", {
      id: route.params.id,
      step1Data: route.params.step1Data,
      step2Data: { gender, weight, height, birthday },
    });
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

    // 성별은 버튼 두 개로 선택
    if (currentModal === "gender") {
      return (
        <>
          <ModalHeader>
            <ModalTitle>성별</ModalTitle>
            <CloseButton onPress={closeModal}>
              <Ionicons name="close" size={24} color="#F2F5FA" />
            </CloseButton>
          </ModalHeader>
          <GenderButtonContainer>
            <GenderButton
              isSelected={tempValue === "남성"}
              onPress={() => setTempValue("남성")}
            >
              <GenderButtonText isSelected={tempValue === "남성"}>
                남성
              </GenderButtonText>
            </GenderButton>
            <GenderButton
              isSelected={tempValue === "여성"}
              onPress={() => setTempValue("여성")}
            >
              <GenderButtonText isSelected={tempValue === "여성"}>
                여성
              </GenderButtonText>
            </GenderButton>
          </GenderButtonContainer>
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

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <ProgressIndicator currentStep={2} />

          <ScrollableContent showsVerticalScrollIndicator={false}>
            <Title>
              정확한 건강 분석에 필요한{"\n"}고객님의 기본 정보를{"\n"}
              입력해주세요.
            </Title>

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
          </ScrollableContent>
        </Content>

        <ButtonContainer>
          <Button variant="primary" onPress={handleNext}>
            다음
          </Button>
        </ButtonContainer>
      </Screen>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={{ flex: 1 }}
        >
          <ModalOverlay>
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
                        currentModal === "gender"
                          ? !tempValue
                          : !tempValue.trim()
                      }
                    >
                      저장
                    </Button>
                  </ModalButtonWrapperLast>
                </ModalButtonContainer>
              </ModalContent>
            </TouchableOpacity>
          </ModalOverlay>
        </TouchableOpacity>
      </Modal>
    </GradientBackground>
  );
};

export default InfoStep2Screen;
