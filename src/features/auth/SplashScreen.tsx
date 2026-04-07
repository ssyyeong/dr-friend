import React, { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import { Dimensions } from "react-native";
import { isLoggedIn } from "../../services/authService";
import BackgroundSvg from "../../../assets/image/splash-background.svg";
import LogoSvg from "../../../assets/logo/splash-logo.svg";
import {
  isLoggedIn as isFitbitLoggedIn,
  loginWithFitbit,
} from "../../services/fitbitAuth"; // 추가

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const Container = styled.View`
  flex: 1;
  background-color: #182e4b;
  align-items: center;
  justify-content: center;
`;

const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const screenData = Dimensions.get("window");

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const loggedIn = await isLoggedIn();

        if (loggedIn) {
          // ✅ Fitbit 연동 여부 확인
          const fitbitLinked = await isFitbitLoggedIn();

          if (!fitbitLinked) {
            // 브라우저 자동으로 띄워서 연동
            try {
              await loginWithFitbit();
            } catch (e) {
              console.log("Fitbit 연동 실패:", e);
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
      <BackgroundContainer>
        <BackgroundSvg
          width={screenData.width}
          height={screenData.height}
          preserveAspectRatio="xMidYMid slice"
        />
      </BackgroundContainer>
      <ContentContainer>
        <LogoSvg />
      </ContentContainer>
    </Container>
  );
};

export default SplashScreen;
