import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";

type Props = NativeStackScreenProps<AuthStackParamList, "Password">;

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

const ButtonContainer = styled.View`
  width: 100%;
`;

const PasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleNext = () => {
    // TODO: 이메일 검증 후 다음 단계로 이동
    if (email.trim()) {
      navigation.navigate("PasswordAuth", { email: email.trim() });
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
          <Title>비밀번호 찾기</Title>
          <Instruction>가입하신 이메일을 입력하세요.</Instruction>
          <Input
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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

export default PasswordScreen;
