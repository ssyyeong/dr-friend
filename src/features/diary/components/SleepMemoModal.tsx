import React from "react";
import { Modal, Pressable } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../shared/components/common/Button";
import SvgIcon from "../../../shared/components/common/SvgIcon";

// 취침 전 메모 옵션 데이터
const sleepMemoOptions = [
  {
    id: "bath",
    label: "따뜻한 목욕",
    icon: require("../../../../assets/icon/bath.svg"),
  },
  {
    id: "drug",
    label: "수면제",
    icon: require("../../../../assets/icon/drug.svg"),
  },
  {
    id: "alcohol",
    label: "알코올",
    icon: require("../../../../assets/icon/alcohol.svg"),
  },
  {
    id: "exercise",
    label: "운동",
    icon: require("../../../../assets/icon/exercise.svg"),
  },
  {
    id: "body",
    label: "스트레칭",
    icon: require("../../../../assets/icon/body.svg"),
  },
  {
    id: "meal",
    label: "야식",
    icon: require("../../../../assets/icon/meal.svg"),
  },
  {
    id: "stress",
    label: "스트레스",
    icon: require("../../../../assets/icon/stress.svg"),
  },
  {
    id: "coffee",
    label: "커피",
    icon: require("../../../../assets/icon/coffee.svg"),
  },
  {
    id: "pain",
    label: "통증",
    icon: require("../../../../assets/icon/pain.svg"),
  },
  {
    id: "sleep",
    label: "낮잠",
    icon: require("../../../../assets/icon/sleep.svg"),
  },
  {
    id: "relaxation",
    label: "명상",
    icon: require("../../../../assets/icon/relaxation.svg"),
  },
  {
    id: "band",
    label: "아픔",
    icon: require("../../../../assets/icon/band.svg"),
  },
  {
    id: "weight",
    label: "과식",
    icon: require("../../../../assets/icon/weight.svg"),
  },
];

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const Backdrop = styled(Pressable)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

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

const OptionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 32px;
  justify-content: space-between;
`;

const OptionButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 109px;
  height: 83px;
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: ${({ selected }) => (selected ? 1 : 0)}px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.text : theme.colors.gray300};
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const OptionIconContainer = styled.View`
  width: 20px;
  height: 20px;
  margin-bottom: 12px;
  align-items: center;
  justify-content: center;
`;

const OptionLabel = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.text : theme.colors.gray300};
  text-align: center;
`;

interface SleepMemoModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  buttonText?: string;
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  onButtonPress?: () => void;
}

const SleepMemoModal: React.FC<SleepMemoModalProps> = ({
  visible,
  onClose,
  title = "취침 전 메모",
  buttonText = "저장",
  selectedOptions,
  onOptionsChange,
  onButtonPress,
}) => {
  const theme = useTheme();

  const handleOptionToggle = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      onOptionsChange(selectedOptions.filter((id) => id !== optionId));
    } else {
      onOptionsChange([...selectedOptions, optionId]);
    }
  };

  const handleButtonPress = () => {
    onButtonPress ? onButtonPress() : onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <Backdrop
          onPress={onClose}
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        />

        {/* ✅ 바텀시트 카드 */}
        <ModalCard
          style={{
            maxHeight: "80%",
          }}
        >
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CloseButton>
          </ModalHeader>

          <OptionsGrid>
            {sleepMemoOptions.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              return (
                <OptionButton
                  key={option.id}
                  selected={isSelected}
                  onPress={() => handleOptionToggle(option.id)}
                  activeOpacity={0.9}
                >
                  <OptionIconContainer>
                    <SvgIcon
                      Component={option.icon.default || option.icon}
                      width={20}
                      height={20}
                      fill={
                        isSelected ? theme.colors.text : theme.colors.gray400
                      }
                    />
                  </OptionIconContainer>
                  <OptionLabel selected={isSelected}>
                    {option.label}
                  </OptionLabel>
                </OptionButton>
              );
            })}
          </OptionsGrid>

          <Button variant="primary" onPress={handleButtonPress}>
            {buttonText}
          </Button>
        </ModalCard>
      </ModalOverlay>
    </Modal>
  );
};

export default SleepMemoModal;
export { sleepMemoOptions };
