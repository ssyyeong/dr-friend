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

const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

const ConfirmButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
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
                  하루 동안 얼마나 깊고 편안하게 주무셨는지를 나타내는
                  지표입니다.
                  {"\n"}
                  {"\n"}총 수면 시간, 잠드는 데 걸린 시간, 중간에 깬 횟수,
                  그리고 깊은 잠·얕은 잠·꿈(렘수면)의 비율 등을 종합하여 스마트
                  닥터프렌드가 자동으로 분석해드립니다.
                  {"\n"}
                  {"\n"}* 수면 시간이 측정되지 않은 경우에는 수면 품질을 계산할
                  수 없습니다.
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
