import React from "react";
import { Modal, TextInput } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../shared/components/common/Button";

// 모달 스타일 컴포넌트
const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const OverlayTouchable = styled.TouchableOpacity`
  flex: 1;
`;

const ModalCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray800};
  border-top-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
  max-height: 90%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const DiaryInput = styled.TextInput`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  min-height: 200px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-align-vertical: top;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

interface SleepDiaryModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  diaryText: string;
  onDiaryTextChange: (text: string) => void;
  onSave: () => void;
}

const SleepDiaryModal: React.FC<SleepDiaryModalProps> = ({
  visible,
  onClose,
  title = "일기",
  diaryText,
  onDiaryTextChange,
  onSave,
}) => {
  const theme = useTheme();

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <OverlayTouchable activeOpacity={1} onPress={onClose} />
        <ModalCard>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onPress={onClose} activeOpacity={1}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CloseButton>
          </ModalHeader>

          <DiaryInput
            placeholder="오늘 하루 기억에 남는 일을 작성해 보세요."
            placeholderTextColor={theme.colors.gray400}
            value={diaryText}
            onChangeText={onDiaryTextChange}
            multiline
            autoFocus
          />

          <ButtonContainer>
            <Button variant="block" onPress={onClose} style={{ flex: 1 }}>
              취소
            </Button>
            <Button variant="primary" onPress={handleSave} style={{ flex: 1 }}>
              저장
            </Button>
          </ButtonContainer>
        </ModalCard>
      </ModalOverlay>
    </Modal>
  );
};

export default SleepDiaryModal;
