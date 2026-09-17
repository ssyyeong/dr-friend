import React, { useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { SafeAreaView } from "../../../shared/components/common/SafeAreaView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Alert, Modal, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const Screen = styled(SafeAreaView)`
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

const ViewButton = styled.TouchableOpacity`
  padding: 4px 8px;
`;

const ViewButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 14px;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray700};
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalCloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const ModalContent = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const TermsSectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const TermsParagraph = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 22px;
  margin-bottom: 8px;
`;

const TermsSubSection = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 22px;
  margin-bottom: 6px;
  padding-left: 8px;
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
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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

  // 약관 모달 상태
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy">("terms");

  const openTermsModal = (type: "terms" | "privacy") => {
    setModalType(type);
    setTermsModalVisible(true);
  };

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeTerms(newValue);
    setAgreePrivacy(newValue);
  };

  const handleAgreeTerms = () => {
    const newValue = !agreeTerms;
    setAgreeTerms(newValue);
    // 두 개별 항목이 모두 true일 때만 agreeAll을 true로
    setAgreeAll(newValue && agreePrivacy);
  };

  const handleAgreePrivacy = () => {
    const newValue = !agreePrivacy;
    setAgreePrivacy(newValue);
    // 두 개별 항목이 모두 true일 때만 agreeAll을 true로
    setAgreeAll(agreeTerms && newValue);
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

  const handleSignup = async () => {
    // 필수 약관 동의 체크
    if (!agreeTerms || !agreePrivacy) {
      Alert.alert("알림", "필수 약관에 모두 동의해주세요.");
      return;
    }

    if (!isVerified) {
      Alert.alert("알림", "본인 인증을 완료해주세요.");
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
        const memberId = response?.data?.result?.APP_MEMBER_IDENTIFICATION_CODE;

        if (memberId) {
          try {
            await saveMemberId(memberId);
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
                  onPress={handleSendVerificationCode}
                  disabled={isLoading || isVerified}
                  style={{ opacity: isLoading || isVerified ? 0.5 : 1 }}
                >
                  <VerifyButtonText>
                    {isVerified
                      ? "인증완료"
                      : isVerificationSent
                        ? "재전송"
                        : "본인 인증"}
                  </VerifyButtonText>
                </VerifyButton>
              </PhoneInputContainer>

              {isVerificationSent && !isVerified && (
                <PhoneInputContainer>
                  <PhoneInput
                    placeholder="인증번호"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    autoFocus
                  />
                  <VerifyButton
                    onPress={handleVerifyCode}
                    disabled={isLoading || !verificationCode}
                    style={{ opacity: isLoading || !verificationCode ? 0.5 : 1 }}
                  >
                    <VerifyButtonText>확인</VerifyButtonText>
                  </VerifyButton>
                </PhoneInputContainer>
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

                <AgreementItem onPress={handleAgreeTerms}>
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
                  <ViewButton onPress={() => openTermsModal("terms")}>
                    <ViewButtonText>보기</ViewButtonText>
                  </ViewButton>
                </AgreementItem>

                <AgreementItemLast onPress={handleAgreePrivacy}>
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
                  <ViewButton onPress={() => openTermsModal("privacy")}>
                    <ViewButtonText>보기</ViewButtonText>
                  </ViewButton>
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

      {/* 약관 모달 */}
      <Modal
        visible={termsModalVisible}
        animationType="slide"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <ModalContainer style={{ paddingTop: insets.top }}>
          <ModalHeader>
            <ModalTitle>
              {modalType === "terms" ? "이용약관" : "개인정보 수집 및 이용"}
            </ModalTitle>
            <ModalCloseButton onPress={() => setTermsModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalContent showsVerticalScrollIndicator={false}>
            {modalType === "terms" ? (
              <>
                <TermsSectionTitle>닥터프렌드 케어 플러스 서비스 이용약관</TermsSectionTitle>
                <TermsParagraph>운영자: 주식회사 디에프월드</TermsParagraph>

                <TermsSectionTitle>제1조 (목적)</TermsSectionTitle>
                <TermsParagraph>
                  이 약관은 주식회사 디에프월드(이하 "회사")가 제공하는 닥터프렌드 케어 플러스 애플리케이션과 이에 부수하는 서비스(이하 "서비스")의 이용에 관하여 회사와 회원 사이의 권리·의무, 책임사항 및 이용 조건을 정함을 목적으로 합니다.
                </TermsParagraph>

                <TermsSectionTitle>제2조 (용어의 정의)</TermsSectionTitle>
                <TermsSubSection>• "회원"이란 이 약관에 동의하고 회사가 정한 절차에 따라 가입하여 서비스를 이용하는 사람을 말합니다.</TermsSubSection>
                <TermsSubSection>• "계정"이란 회원의 식별과 서비스 이용을 위하여 생성되는 로그인 정보와 이에 연결된 서비스 이용 단위를 말합니다.</TermsSubSection>
                <TermsSubSection>• "연동기기"란 서비스와 연결하여 수면·활동·생체 관련 정보를 전송하는 웨어러블 기기, 센서 또는 그 밖에 회사가 지원하는 기기를 말합니다.</TermsSubSection>
                <TermsSubSection>• "측정정보"란 연동기기, 외부 플랫폼 또는 회원의 입력을 통해 생성되어 서비스가 처리하는 수면·활동·생체 관련 정보를 말합니다.</TermsSubSection>
                <TermsSubSection>• "분석정보"란 측정정보와 이용기록을 바탕으로 서비스가 제공하는 수면 기록, 점수, 추세, 통계, 코칭 또는 이에 준하는 정보를 말합니다.</TermsSubSection>

                <TermsSectionTitle>제3조 (약관의 게시, 효력 및 개정)</TermsSectionTitle>
                <TermsSubSection>① 회사는 회원이 이 약관을 쉽게 확인할 수 있도록 가입 화면, 서비스 내 설정 또는 연결 화면 등에 게시합니다.</TermsSubSection>
                <TermsSubSection>② 회사는 관계 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.</TermsSubSection>
                <TermsSubSection>③ 회사가 약관을 개정하는 경우 적용일과 개정 사유를 명시하여 원칙적으로 적용일 7일 전부터 공지합니다.</TermsSubSection>

                <TermsSectionTitle>제5조 (이용계약의 성립)</TermsSectionTitle>
                <TermsSubSection>① 이용계약은 서비스를 이용하려는 사람이 이 약관과 필요한 개인정보 처리 사항을 확인하고 동의한 후 가입을 신청하고, 회사가 이를 승인함으로써 성립합니다.</TermsSubSection>
                <TermsSubSection>② 회사는 휴대전화, 전자우편 또는 소셜 계정 등을 이용한 인증 절차를 제공하거나 요구할 수 있습니다.</TermsSubSection>

                <TermsSectionTitle>제6조 (이용 연령)</TermsSectionTitle>
                <TermsSubSection>① 서비스에는 만 14세 이상인 사람만 가입할 수 있습니다.</TermsSubSection>

                <TermsSectionTitle>제13조 (건강관리 정보와 의료적 한계)</TermsSectionTitle>
                <TermsSubSection>① 서비스의 분석, 코칭과 콘텐츠는 일상적인 건강관리와 생활습관 개선을 돕기 위한 참고 정보입니다.</TermsSubSection>
                <TermsSubSection>② 서비스는 질병의 진단·치료·예방, 의약품 처방, 응급상황 판단 또는 의료인의 전문적인 판단을 대신하지 않습니다.</TermsSubSection>

                <TermsSectionTitle>제28조 (준거법과 분쟁 해결)</TermsSectionTitle>
                <TermsSubSection>① 이 약관의 해석과 서비스 이용에 관해서는 대한민국 법령을 적용합니다.</TermsSubSection>

                <TermsParagraph style={{ marginTop: 20, color: theme.colors.gray400 }}>
                  * 전체 약관은 프로필 {'>'} 이용약관/개인정보 정책에서 확인할 수 있습니다.
                </TermsParagraph>
              </>
            ) : (
              <>
                <TermsSectionTitle>개인정보 수집 및 이용 동의</TermsSectionTitle>

                <TermsSectionTitle>1. 수집하는 개인정보 항목</TermsSectionTitle>
                <TermsSubSection>• 필수항목: 이메일 주소, 비밀번호, 휴대전화번호</TermsSubSection>
                <TermsSubSection>• 선택항목: 생년월일, 성별, 신장, 체중</TermsSubSection>
                <TermsSubSection>• 자동 수집 항목: 서비스 이용 기록, 접속 로그, 기기 정보</TermsSubSection>
                <TermsSubSection>• 건강정보: 수면 데이터, 활동량 데이터 (연동기기 이용 시)</TermsSubSection>

                <TermsSectionTitle>2. 개인정보의 수집 및 이용 목적</TermsSectionTitle>
                <TermsSubSection>• 회원 가입 및 관리: 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</TermsSubSection>
                <TermsSubSection>• 서비스 제공: 수면 측정, 분석, 코칭 등 서비스 제공</TermsSubSection>
                <TermsSubSection>• 고객 문의 대응: 민원 처리, 공지사항 전달</TermsSubSection>

                <TermsSectionTitle>3. 개인정보의 보유 및 이용 기간</TermsSectionTitle>
                <TermsSubSection>• 회원 정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간)</TermsSubSection>
                <TermsSubSection>• 건강정보: 수집일로부터 1년 (또는 회원 탈퇴 시)</TermsSubSection>

                <TermsSectionTitle>4. 동의 거부권 및 거부 시 불이익</TermsSectionTitle>
                <TermsParagraph>
                  귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수항목에 대한 동의를 거부할 경우 회원가입이 제한됩니다.
                </TermsParagraph>

                <TermsParagraph style={{ marginTop: 20, color: theme.colors.gray400 }}>
                  * 전체 개인정보처리방침은 프로필 {'>'} 이용약관/개인정보 정책에서 확인할 수 있습니다.
                </TermsParagraph>
              </>
            )}
          </ModalContent>
        </ModalContainer>
      </Modal>
    </GradientBackground>
  );
};

export default SignupScreen;
