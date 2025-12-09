import React, { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import { View, Dimensions } from "react-native";

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
    const timer = setTimeout(() => {
      // TODO: 나중에 토큰 체크해서 MainTab으로 바로 보낼 수도 있음
      navigation.replace("MainTab");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  const BackgroundSvgComponent =
    require("../../../assets/image/splash-background.svg").default ||
    require("../../../assets/image/splash-background.svg");
  const LogoSvgComponent =
    require("../../../assets/logo/splash-logo.svg").default ||
    require("../../../assets/logo/splash-logo.svg");

  return (
    <Container>
      <BackgroundContainer>
        <BackgroundSvgComponent
          width={screenData.width}
          height={screenData.height}
          preserveAspectRatio="xMidYMid slice"
        />
      </BackgroundContainer>
      <ContentContainer>
        <LogoSvgComponent />
      </ContentContainer>
    </Container>
  );
};

export default SplashScreen;
