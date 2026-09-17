import React, { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import { isLoggedIn } from "../../services/authService";
import { isLoggedIn as isFitbitLoggedIn, loginWithFitbit } from "../../services/fitbitAuth";
import LogoSvg from "../../../assets/logo/splash-logo.svg";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const Container = styled.View`
  flex: 1;
  background-color: #182e4b;
  align-items: center;
  justify-content: center;
`;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const loggedIn = await isLoggedIn();
        if (loggedIn) {
          // 앱 로그인 되어 있으면 Fitbit 로그인 상태도 체크
          const fitbitLoggedIn = await isFitbitLoggedIn();
          if (!fitbitLoggedIn) {
            // Fitbit 로그인 안 되어 있으면 자동으로 로그인 시도
            try {
              await loginWithFitbit();
            } catch (fitbitError) {
              console.log("Fitbit 로그인 취소 또는 실패:", fitbitError);
              // Fitbit 로그인 실패해도 앱은 계속 진행
            }
          }
          setTimeout(() => navigation.replace("MainTab"), 1500);
        } else {
          setTimeout(() => navigation.replace("Auth"), 1500);
        }
      } catch (error) {
        console.error("인증 상태 확인 실패:", error);
        setTimeout(() => navigation.replace("Auth"), 1500);
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);

  return (
    <Container>
      <LogoSvg />
    </Container>
  );
};

export default SplashScreen;
