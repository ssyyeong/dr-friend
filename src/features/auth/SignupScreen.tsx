import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../app/navigation/RootNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: 32px 24px 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const Input = styled.TextInput`
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 0 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray600};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const PrimaryButton = styled.TouchableOpacity`
  height: 52px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const PrimaryButtonLabel = styled.Text`
  color: ${({ theme }) => theme.colors.gray0};
  font-size: 16px;
  font-weight: 600;
`;

const BackToLoginButton = styled.TouchableOpacity`
  margin-top: 16px;
  align-items: center;
`;

const BackToLoginText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // TODO: 실제 회원가입 API 호출
    // 성공 시 SignupSuccess 화면으로 이동
    navigation.navigate("SignupSuccess");
  };

  return (
    <Screen>
      <Content>
        <Title>회원가입</Title>

        <Label>이름</Label>
        <Input
          placeholder="이름"
          placeholderTextColor="#6E86A5"
          value={name}
          onChangeText={setName}
        />

        <Label>이메일</Label>
        <Input
          placeholder="example@email.com"
          placeholderTextColor="#6E86A5"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Label>비밀번호</Label>
        <Input
          placeholder="비밀번호"
          placeholderTextColor="#6E86A5"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton activeOpacity={0.8} onPress={handleSignup}>
          <PrimaryButtonLabel>회원가입 완료</PrimaryButtonLabel>
        </PrimaryButton>

        <BackToLoginButton onPress={() => navigation.goBack()}>
          <BackToLoginText>이미 계정이 있으신가요? 로그인</BackToLoginText>
        </BackToLoginButton>
      </Content>
    </Screen>
  );
};

export default SignupScreen;
