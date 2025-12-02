import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";

type Props = NativeStackScreenProps<AuthStackParamList, "PasswordChange">;

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
  padding-bottom: 24px;
`;

const PasswordChangeScreen: React.FC<Props> = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleNext = () => {};

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <Title>비밀번호 재설정</Title>
          <Instruction>신규 비밀번호를 설정해주세요.</Instruction>

          <Input
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />
        </Content>
        <ButtonContainer>
          <Button variant="primary" onPress={handleNext}>
            완료
          </Button>
        </ButtonContainer>
      </Screen>
    </GradientBackground>
  );
};

export default PasswordChangeScreen;
