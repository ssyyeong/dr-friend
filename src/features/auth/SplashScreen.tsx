import React, { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app/navigation/RootNavigator";
import { ImageBackground, Image } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const Container = styled.View`
  flex: 1;
  background-color: #182e4b;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.Image`
  resize-mode: contain;
`;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: 나중에 토큰 체크해서 MainTab으로 바로 보낼 수도 있음
      navigation.replace("MainTab");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Container>
      <BackgroundImage
        source={require("../../../assets/image/splash-background.svg")}
        resizeMode="cover"
      >
        <ContentContainer>
          <LogoImage
            source={require("../../../assets/logo/splash-logo.svg")}
            resizeMode="contain"
          />
        </ContentContainer>
      </BackgroundImage>
    </Container>
  );
};

export default SplashScreen;
