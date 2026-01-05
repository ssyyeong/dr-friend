import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../app/navigation/RootNavigator";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import Button from "../../shared/components/common/Button";
import SocialButton from "../../shared/components/common/SocialButton";
import { saveMemberId, saveToken } from "../../services/authService";
import LogoSvg from "../../../assets/logo/logo.svg";
import AppleLogoSvg from "../../../assets/logo/apple.svg";
import GoogleLogoSvg from "../../../assets/logo/google.svg";
import AppMemberController from "../../services/AppMemberController";

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

const LogoContainer = styled.View`
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 32px;
`;

const PasswordButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
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

  const handleLogin = async () => {
    try {
      const controller = new AppMemberController({
        modelName: "AppMember",
        modelId: "app_member",
      });

      const response = await controller.signIn({
        USER_NAME: email,
        PASSWORD: password,
      });
      console.log(
        "response",
        response?.data?.result?.user?.APP_MEMBER_IDENTIFICATION_CODE
      );

      // TODO: 여기서 실제 로그인 API 호출 예정
      // const response = await loginAPI(email, password);
      // const token = response.data.token;

      // 로그인 성공 시 토큰 저장
      if (response?.status === 200) {
        await saveMemberId(
          response?.data?.result?.user?.APP_MEMBER_IDENTIFICATION_CODE
        );
        (navigation as any).getParent()?.navigate("MainTab");
      }
      // 로그인 성공하면 RootStack의 MainTab으로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      // TODO: 에러 메시지 표시 (예: Alert 또는 Toast)
    }
  };

  const goToSignup = () => {
    navigation.navigate("Signup");
  };

  const handleAppleLogin = async () => {
    try {
      // TODO: Apple 로그인 로직
      // const response = await appleLoginAPI();
      // const token = response.data.token;

      // 임시: 실제 API 연결 전까지는 테스트용 토큰 사용
      const mockToken = "apple_token_" + Date.now();

      // 로그인 성공 시 토큰 저장
      await saveToken(mockToken);

      // 로그인 성공하면 RootStack의 MainTab으로 이동
      (navigation as any).getParent()?.navigate("MainTab");
    } catch (error) {
      console.error("Apple 로그인 실패:", error);
      // TODO: 에러 메시지 표시
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Google 로그인 로직
      // const response = await googleLoginAPI();
      // const token = response.data.token;

      // 임시: 실제 API 연결 전까지는 테스트용 토큰 사용
      const mockToken = "google_token_" + Date.now();

      // 로그인 성공 시 토큰 저장
      await saveToken(mockToken);

      // 로그인 성공하면 RootStack의 MainTab으로 이동
      (navigation as any).getParent()?.navigate("MainTab");
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      // TODO: 에러 메시지 표시
    }
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <LogoContainer>
          <LogoSvg width={200} height={60} />
        </LogoContainer>
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
          <PasswordButton onPress={() => navigation.navigate("Password")}>
            <PasswordButtonText>비밀번호 찾기</PasswordButtonText>
          </PasswordButton>

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
            icon={AppleLogoSvg}
            label="Apple로 로그인하기"
            onPress={handleAppleLogin}
          />

          <SocialButton
            icon={GoogleLogoSvg}
            label="Google로 로그인하기"
            onPress={handleGoogleLogin}
          />
        </Content>
      </Screen>
    </GradientBackground>
  );
};

export default LoginScreen;
