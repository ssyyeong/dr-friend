import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import styled, { useTheme } from "styled-components/native";
import SvgIcon from "../../../shared/components/common/SvgIcon";
import Button from "../../../shared/components/common/Button";

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.gray600};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  width: 100%;
  max-width: 343px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const InfoIcon = styled.View`
  margin-right: 8px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalBody = styled.View`
  margin-bottom: 24px;
`;

const ModalText = styled.Text`
  font-size: 16px;
  line-height: 25.6px;
  color: ${({ theme }) => theme.colors.gray200};
`;

interface SleepQualityInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const SleepQualityInfoModal: React.FC<SleepQualityInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const InfoIconComponent =
    require("../../../../assets/icon/information-circle.svg").default ||
    require("../../../../assets/icon/information-circle.svg");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1 }}>
        <ModalOverlay>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <ModalContent>
              <ModalHeader>
                <InfoIcon>
                  <SvgIcon
                    Component={InfoIconComponent}
                    width={24}
                    height={24}
                    fill={theme.colors.secondary}
                  />
                </InfoIcon>
                <ModalTitle>수면 품질이란?</ModalTitle>
              </ModalHeader>

              <ModalBody>
                <ModalText>
                  수면 품질은 어젯밤에 얼마나 깊고 편안하게 주무셨는지를
                  알려주는 값입니다. 잠을 잔 전체 시간, 잠드는 데 걸린 시간,
                  자는 동안 깬 횟수, 깊게 잔 시간과 얕게 잔 시간 등을 바탕으로
                  스마트닥터프렌드가 자동으로 살펴봐 드립니다.
                  {"\n"}
                  {"\n"}※ 수면 시간이 기록되지 않으면 수면 품질은 계산되지
                  않습니다.
                </ModalText>
              </ModalBody>
              <Button variant="block" onPress={onClose}>
                확인
              </Button>
            </ModalContent>
          </TouchableOpacity>
        </ModalOverlay>
      </TouchableOpacity>
    </Modal>
  );
};

export default SleepQualityInfoModal;
