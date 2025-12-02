import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";

type Props = NativeStackScreenProps<AuthStackParamList, "PasswordAuth">;

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
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 40px;
  text-align: center;
`;

const Instruction = styled.Text`
  font-size: 26px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 40px;
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.gray500,
}))`
  height: 52px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
  font-size: 18px;
`;

const PhoneInputContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const PhoneInput = styled(Input)`
  margin-right: 8px;
  margin-bottom: 0;
`;

const VerifyButton = styled.TouchableOpacity`
  height: 52px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  justify-content: center;
  align-items: center;
  min-width: 106px;
`;

const VerifyButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding-bottom: 24px;
`;

const PasswordAuthScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerifyIdentity = () => {
    // TODO: 본인 인증 로직
  };

  const handleNext = () => {};

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <Title>비밀번호 찾기</Title>
          <Instruction>
            가입하신 휴대폰 번호로 인증을 {`\n`}진행 해주세요.
          </Instruction>

          <PhoneInputContainer>
            <PhoneInput
              placeholder="휴대폰 번호"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <VerifyButton onPress={handleVerifyIdentity}>
              <VerifyButtonText>본인 인증</VerifyButtonText>
            </VerifyButton>
          </PhoneInputContainer>

          <Input
            placeholder="인증번호"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
        </Content>
        <ButtonContainer>
          <Button variant="primary" onPress={handleNext}>
            다음
          </Button>
        </ButtonContainer>
      </Screen>
    </GradientBackground>
  );
};

export default PasswordAuthScreen;
