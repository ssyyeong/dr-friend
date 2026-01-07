import React from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../shared/components/common/Button";

const ModalCard = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray800};
  border-top-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  margin-bottom: 16px;
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
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      presentationStyle="overFullScreen" // ✅ iOS에서 확실히 전체 덮기
      hardwareAccelerated // ✅ Android z-order 안정화
    >
      <View style={styles.root}>
        {/* ✅ 화면 전체 덮는 딤 + 바깥 터치 닫기 */}
        <Pressable
          style={[StyleSheet.absoluteFillObject, styles.backdrop]}
          onPress={onClose}
        />

        {/* ✅ 아래에서 올라오는 카드 레이아웃을 flex로 안정화 */}
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ModalCard
            style={[
              styles.cardShadow,
              {
                maxHeight: "90%",
              },
            ]}
          >
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <CloseButton onPress={onClose} activeOpacity={0.8}>
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
              <Button
                variant="primary"
                onPress={handleSave}
                style={{ flex: 1 }}
              >
                저장
              </Button>
            </ButtonContainer>
          </ModalCard>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.45)", // ✅ 탭바가 더 안 보이게 원하면 0.55~0.6
  },
  kav: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardShadow: {
    elevation: 20,
    zIndex: 999,
  },
});

export default SleepDiaryModal;
