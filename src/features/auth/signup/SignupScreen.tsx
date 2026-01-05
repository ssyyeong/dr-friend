import React, { useState } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import AppMemberController from "../../../services/AppMemberController";
import { saveMemberId } from "../../../services/authService";
import PrimaryBoxCheckSvg from "../../../../assets/icon/primary-box-check.svg";
import GrayBoxCheckSvg from "../../../../assets/icon/gray-box-check.svg";
import PrimaryCheckSvg from "../../../../assets/icon/primary-check.svg";
import GrayCheckSvg from "../../../../assets/icon/gray-check.svg";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const ScrollContent = styled.View`
  padding: 24px 16px;
  align-items: center;
  padding-bottom: 100px;
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
  flex: 1;
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

const CheckboxContainer = styled.View`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
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
  position: absolute;
  bottom: 50;
  left: 0;
  right: 0;
  width: 100%;
  padding: 16px;
  background-color: transparent;
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

  // 본인 인증 상태
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
  };

  // 인증번호 전송
  const handleSendVerificationCode = async () => {
    // 전화번호 유효성 검사
    if (!phoneNumber || phoneNumber.trim() === "") {
      console.warn("전화번호를 입력해주세요.");
      // TODO: 사용자에게 알림 표시 (Alert 또는 Toast)
      return;
    }

    setIsLoading(true);
    try {
      console.log("=== 인증번호 전송 요청 시작 ===");
      console.log("전화번호:", phoneNumber);

      const controller = new AppMemberController({
        modelName: "AppMember",
        modelId: "app_member",
      });

      const response = await controller.sendPhoneNumberVerificationCode({
        TARGET_PHONE_NUMBER: phoneNumber,
      });

      if (response?.status === 200) {
        console.log("인증번호 전송 성공");
        setIsVerificationSent(true);
        setVerificationCode(""); // 인증번호 입력란 초기화
        setVerifyCode(response?.data?.result);
        // TODO: 성공 메시지 표시 및 타이머 시작
      } else {
        console.warn("예상치 못한 응답 상태:", response?.status);
      }
    } catch (error: any) {
      console.error("인증번호 전송 실패:", {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });

      // TODO: 사용자에게 에러 메시지 표시 (Alert 또는 Toast)
      if (error?.response) {
        console.error("서버 에러:", error.response.data);
      } else if (error?.request) {
        console.error("네트워크 에러: 서버에 연결할 수 없습니다.");
      } else {
        console.error("요청 설정 에러:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.trim() === "") {
      console.warn("인증번호를 입력해주세요.");
      // TODO: 사용자에게 알림 표시
      return;
    }

    setIsLoading(true);
    try {
      console.log("=== 인증번호 검증 요청 시작 ===");
      console.log("전화번호:", phoneNumber);
      console.log("인증번호:", verificationCode);

      const controller = new AppMemberController({
        modelName: "AppMember",
        modelId: "app_member",
      });

      const response = await controller.verifyPhoneVerificationCode({
        ENCRYPTED_AUTH_CODE: verifyCode,
        AUTH_CODE: verificationCode,
      });

      if (response?.status === 200) {
        console.log("인증 완료");
        setIsVerified(true);
        // TODO: 성공 메시지 표시
      } else {
        console.warn("인증 실패:", response?.status);
        // TODO: 에러 메시지 표시
      }
    } catch (error: any) {
      console.error("요청 설정 에러:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 본인 인증 버튼 핸들러
  const handleVerifyIdentity = () => {
    if (isVerified) {
      return; // 이미 인증 완료
    }

    if (isVerificationSent) {
      // 인증번호 검증
      handleVerifyCode();
    } else {
      // 인증번호 전송
      handleSendVerificationCode();
    }
  };

  const handleSignup = async () => {
    if (!isVerified) {
      console.warn("인증이 완료되지 않았습니다.");
      return;
    }

    try {
      const controller = new AppMemberController({
        modelName: "AppMember",
        modelId: "app_member",
      });

      const response = await controller.signUp({
        USER_NAME: email,
        PASSWORD: password,
        PHONE_NUMBER: phoneNumber,
      });
      if (response?.status === 200) {
        console.log("회원가입 성공");
        const memberId = response?.data?.result?.APP_MEMBER_IDENTIFICATION_CODE;

        if (memberId) {
          try {
            await saveMemberId(memberId);
            console.log("memberId 저장 성공:", memberId);
            navigation.navigate("SignupSuccess", {
              id: memberId,
            });
          } catch (error) {
            console.error("memberId 저장 실패:", error);
            // memberId 저장 여부와 관계없이 navigation 실행
            navigation.navigate("SignupSuccess", {
              id: memberId,
            });
            // 저장 실패해도 navigation은 계속 진행
          }
        }
      } else {
        console.warn("회원가입 실패:", response?.status);
        // TODO: 사용자에게 에러 메시지 표시
      }
    } catch (error) {
      console.error("회원가입 중 에러 발생:", error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <ScrollContainer
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <ScrollContent>
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
                  editable={!isVerified} // 인증 완료 시 수정 불가
                />
                <VerifyButton
                  onPress={handleVerifyIdentity}
                  disabled={isLoading || isVerified}
                  style={{ opacity: isLoading || isVerified ? 0.5 : 1 }}
                >
                  <VerifyButtonText>
                    {isVerified
                      ? "인증완료"
                      : isVerificationSent
                      ? "인증하기"
                      : "본인 인증"}
                  </VerifyButtonText>
                </VerifyButton>
              </PhoneInputContainer>

              {isVerificationSent && !isVerified && (
                <Input
                  placeholder="인증번호"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  autoFocus
                />
              )}

              {isVerified && (
                <Input
                  placeholder="인증완료"
                  value="인증이 완료되었습니다"
                  editable={false}
                  style={{
                    backgroundColor: "rgba(115, 83, 255, 0.2)",
                    borderWidth: 1,
                    borderColor: "#7353FF",
                  }}
                />
              )}

              <AgreementContainer>
                <AgreementAll onPress={handleAgreeAll}>
                  <CheckboxContainer>
                    {agreeAll ? (
                      <PrimaryBoxCheckSvg width={20} height={20} />
                    ) : (
                      <GrayBoxCheckSvg width={20} height={20} />
                    )}
                  </CheckboxContainer>
                  <AllAgreementText>모두 동의</AllAgreementText>
                </AgreementAll>

                <AgreementItem onPress={() => setAgreeTerms(!agreeTerms)}>
                  <CheckboxContainer>
                    {agreeTerms ? (
                      <PrimaryCheckSvg width={20} height={20} />
                    ) : (
                      <GrayCheckSvg width={20} height={20} />
                    )}
                  </CheckboxContainer>
                  <AgreementText>
                    이용약관에 동의합니다.
                    <RequiredText>(필수)</RequiredText>
                  </AgreementText>
                </AgreementItem>

                <AgreementItemLast
                  onPress={() => setAgreePrivacy(!agreePrivacy)}
                >
                  <CheckboxContainer>
                    {agreePrivacy ? (
                      <PrimaryCheckSvg width={20} height={20} />
                    ) : (
                      <GrayCheckSvg width={20} height={20} />
                    )}
                  </CheckboxContainer>
                  <AgreementText>
                    개인정보 수집 및 이용에 동의합니다.
                    <RequiredText>(필수)</RequiredText>
                  </AgreementText>
                </AgreementItemLast>
              </AgreementContainer>
            </Content>
          </ScrollContent>
        </ScrollContainer>
        <ButtonContainer>
          <Button variant="primary" onPress={handleSignup}>
            회원가입
          </Button>
        </ButtonContainer>
      </Screen>
    </GradientBackground>
  );
};

export default SignupScreen;
