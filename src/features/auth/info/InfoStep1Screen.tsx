import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import ProgressIndicator from "./ProgressIndicator";
import { Ionicons } from "@expo/vector-icons";
import PrimaryCheckSvg from "../../../../assets/icon/primary-check.svg";
import GrayCheckSvg from "../../../../assets/icon/gray-check.svg";
type Props = NativeStackScreenProps<AuthStackParamList, "InfoStep1">;

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

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 36px;
`;

const OptionButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ selected, theme }) =>
    selected ? "rgba(115, 83, 255, 0.20)" : theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-width: ${({ selected }) => (selected ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const OptionText = styled.Text`
  flex: 1;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: transparent;
`;

const InfoStep1Screen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    "더 나은 숙면을 위해서",
    "수면 패턴을 기록하고 싶어서",
    "건강 관리(컨디션, 피로개선) 을 위해",
    "단순히 궁금해서, 체험 목적",
    "닥터프렌드 제품과 함께 사용",
  ];

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      navigation.navigate("InfoStep2", {
        id: route?.params?.id,
        step1Data: selectedOptions,
      });
    }
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <ProgressIndicator currentStep={1} />

          <Title>
            Smart Dr.Friend {"\n"}앱 사용으로 기대하는 것은{"\n"} 무엇인가요?
            (다중 선택)
          </Title>

          {options.map((option, index) => (
            <OptionButton
              key={index}
              selected={selectedOptions.includes(option)}
              onPress={() => toggleOption(option)}
              activeOpacity={1}
            >
              <OptionText>{option}</OptionText>
              {selectedOptions.includes(option) ? (
                <PrimaryCheckSvg width={24} height={24} />
              ) : (
                <GrayCheckSvg width={24} height={24} />
              )}
            </OptionButton>
          ))}
        </Content>

        <ButtonContainer>
          <Button
            variant={selectedOptions.length === 0 ? "block" : "primary"}
            onPress={handleNext}
            disabled={selectedOptions.length === 0}
          >
            다음
          </Button>
        </ButtonContainer>
      </Screen>
    </GradientBackground>
  );
};

export default InfoStep1Screen;
