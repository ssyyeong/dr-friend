import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  Platform,
  StyleSheet,
  View,
  Keyboard,
  Animated,
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
  min-height: 150px;
  max-height: 200px;
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
  const insets = useSafeAreaInsets();

  // 임시 텍스트 state (취소 시 원본 유지를 위해)
  const [tempText, setTempText] = useState(diaryText);
  const [keyboardHeight] = useState(new Animated.Value(0));

  // 모달이 열릴 때마다 현재 텍스트로 초기화
  useEffect(() => {
    if (visible) {
      setTempText(diaryText);
    }
  }, [visible, diaryText]);

  // 키보드 높이 감지
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === "ios" ? 250 : 100,
        useNativeDriver: false,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === "ios" ? 250 : 100,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const handleSave = () => {
    Keyboard.dismiss();
    onDiaryTextChange(tempText);
    onSave();
    onClose();
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setTempText(diaryText);
    onClose();
  };

  // 하단 패딩: 키보드 높이 또는 safe area bottom
  const bottomPadding = keyboardHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [insets.bottom || 24, 1],
    extrapolate: "clamp",
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* 배경 딤 + 바깥 터치 닫기 */}
        <Pressable
          style={[StyleSheet.absoluteFillObject, styles.backdrop]}
          onPress={handleCancel}
        />

        {/* 모달 카드 */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              paddingBottom: keyboardHeight,
            },
          ]}
        >
          <ModalCard style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <CloseButton onPress={handleCancel} activeOpacity={0.8}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </CloseButton>
            </ModalHeader>

            <DiaryInput
              placeholder="오늘 하루 기억에 남는 일을 작성해 보세요."
              placeholderTextColor={theme.colors.gray400}
              value={tempText}
              onChangeText={setTempText}
              multiline
              autoFocus={false}
              scrollEnabled={true}
            />

            <ButtonContainer>
              <Button variant="block" onPress={handleCancel} style={{ flex: 1 }}>
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
        </Animated.View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cardContainer: {
    width: "100%",
  },
});

export default SleepDiaryModal;
