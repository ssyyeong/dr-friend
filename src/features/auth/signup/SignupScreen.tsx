import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
  padding: 24px 16px;
  align-items: center;
`;

const Content = styled.View`
  width: 100%;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
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
  margin-bottom: 12px;
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

const AgreementContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  margin-top: 32px;
`;

const AgreementItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const AgreementAll = styled(AgreementItem)`
  margin-bottom: 20px;
`;

const AgreementItemLast = styled(AgreementItem)`
  margin-bottom: 0;
`;

const CheckboxImage = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 12px;
`;

const AllAgreementText = styled.Text`
  flex: 1;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const AgreementText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const RequiredText = styled.Text`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 16px;
  margin-left: 4px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  margin-bottom: 24px;
  padding-left: 16px;
  padding-right: 16px;
`;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [agreeAll, setAgreeAll] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
  };

  const handleVerifyIdentity = () => {
    // TODO: 본인 인증 로직
  };

  const handleSignup = () => {
    // TODO: 실제 회원가입 API 호출
    // 성공 시 SignupSuccess 화면으로 이동
    navigation.navigate("SignupSuccess");
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <Title>회원가입</Title>
          <Input
            placeholder="이메일"
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

          <Input
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />

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

          <AgreementContainer>
            <AgreementAll onPress={handleAgreeAll}>
              {agreeAll ? (
                <CheckboxImage
                  source={require("../../../../assets/icon/primary-box-check.svg")}
                  resizeMode="contain"
                />
              ) : (
                <CheckboxImage
                  source={require("../../../../assets/icon/gray-box-check.svg")}
                  resizeMode="contain"
                />
              )}
              <AllAgreementText>모두 동의</AllAgreementText>
            </AgreementAll>

            <AgreementItem onPress={() => setAgreeTerms(!agreeTerms)}>
              {agreeTerms ? (
                <CheckboxImage
                  source={require("../../../../assets/icon/primary-check.svg")}
                  resizeMode="contain"
                />
              ) : (
                <CheckboxImage
                  source={require("../../../../assets/icon/gray-check.svg")}
                  resizeMode="contain"
                />
              )}
              <AgreementText>
                이용약관에 동의합니다.
                <RequiredText>(필수)</RequiredText>
              </AgreementText>
            </AgreementItem>

            <AgreementItemLast onPress={() => setAgreePrivacy(!agreePrivacy)}>
              {agreePrivacy ? (
                <CheckboxImage
                  source={require("../../../../assets/icon/primary-check.svg")}
                  resizeMode="contain"
                />
              ) : (
                <CheckboxImage
                  source={require("../../../../assets/icon/gray-check.svg")}
                  resizeMode="contain"
                />
              )}
              <AgreementText>
                개인정보 수집 및 이용에 동의합니다.
                <RequiredText>(필수)</RequiredText>
              </AgreementText>
            </AgreementItemLast>
          </AgreementContainer>
        </Content>
      </Screen>
      <ButtonContainer>
        <Button variant="primary" onPress={handleSignup}>
          회원가입
        </Button>
      </ButtonContainer>
    </GradientBackground>
  );
};

export default SignupScreen;
