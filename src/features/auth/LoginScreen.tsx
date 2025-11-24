import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../app/navigation/RootNavigator";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import Button from "../../shared/components/common/Button";
import SocialButton from "../../shared/components/common/SocialButton";

type Props = NativeStackScreenProps<AuthStackParamList, "Login"> & {
  // RootStack 네비도 써야해서 any 피하려고 추가
  rootNavigation?: any;
};

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
  padding: 60px 16px 24px;
  align-items: center;
`;

const LogoImage = styled.Image`
  margin-bottom: 40px;
  resize-mode: contain;
`;

const Content = styled.View`
  flex: 1;
  width: 100%;
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.gray500,
}))`
  height: 52px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
  font-size: 18px;
`;

const PasswordButton = styled.TouchableOpacity`
  width: 118px;
  height: 43px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text};
`;

const GhostButtonContainer = styled.View`
  margin-top: 12px;
`;

const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const DividerText = styled.Text`
  margin-horizontal: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 17px;
`;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: 여기서 실제 로그인 API 호출 예정
    // 로그인 성공하면 RootStack의 MainTab으로 이동
    // AuthStack 안에서는 RootStack을 못 직접 부르니까, RootNavigation 접근하는 패턴 or
    // 지금은 그냥 navigation.navigate로 대체 (나중에 context로 빼도 됨)
    (navigation as any).getParent()?.navigate("MainTab");
  };

  const goToSignup = () => {
    navigation.navigate("Signup");
  };

  const handleAppleLogin = () => {
    // TODO: Apple 로그인 로직
  };

  const handleGoogleLogin = () => {
    // TODO: Google 로그인 로직
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <LogoImage
          source={require("../../../assets/logo/logo.svg")}
          resizeMode="contain"
        />
        <Content>
          <Input
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <PasswordButton onPress={() => {}}>비밀번호 찾기</PasswordButton>

          <Button variant="primary" onPress={handleLogin}>
            로그인
          </Button>

          <GhostButtonContainer>
            <Button variant="ghost" onPress={goToSignup}>
              회원가입
            </Button>
          </GhostButtonContainer>

          <DividerContainer>
            <DividerLine />
            <DividerText>or</DividerText>
            <DividerLine />
          </DividerContainer>

          <SocialButton
            icon={require("../../../assets/logo/apple.svg")}
            label="Apple로 로그인하기"
            onPress={handleAppleLogin}
          />

          <SocialButton
            icon={require("../../../assets/logo/google.svg")}
            label="Google로 로그인하기"
            onPress={handleGoogleLogin}
          />
        </Content>
      </Screen>
    </GradientBackground>
  );
};

export default LoginScreen;
