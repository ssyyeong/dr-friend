import React, { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import { Dimensions } from "react-native";
import { isLoggedIn } from "../../services/authService";
import BackgroundSvg from "../../../assets/image/splash-background.svg";
import LogoSvg from "../../../assets/logo/splash-logo.svg";

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
        // 로그인 상태 확인
        const loggedIn = await isLoggedIn();
        console.log("loggedIn", loggedIn);

        // 1.5초 후 로그인 상태에 따라 화면 이동
        setTimeout(() => {
          if (loggedIn) {
            // 로그인된 경우 메인 탭으로 이동
            navigation.replace("MainTab");
          } else {
            // 로그인되지 않은 경우 로그인 화면으로 이동
            navigation.replace("Auth");
          }
        }, 1500);
      } catch (error) {
        console.error("인증 상태 확인 실패:", error);
        // 에러 발생 시 로그인 화면으로 이동
        setTimeout(() => {
          navigation.replace("Auth");
        }, 1500);
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
