import React from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import RoundCheckSvg from "../../../../assets/icon/round-check.svg";

type Props = NativeStackScreenProps<AuthStackParamList, "SignupSuccess">;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
  padding: 60px 16px 24px;
  align-items: center;
  justify-content: center;
`;

const Content = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CheckIconContainer = styled.View`
  margin-bottom: 36px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

const Description = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.gray300};
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

const SignUpSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const handleGoToLogin = () => {
    navigation.navigate("InfoStep1", { id: route?.params?.id });
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <CheckIconContainer>
            <RoundCheckSvg width={100} height={100} />
          </CheckIconContainer>
          <Title>회원가입 완료</Title>
          <Description>가입이 완료되었습니다.</Description>
        </Content>
      </Screen>
      <ButtonContainer>
        <Button variant="primary" onPress={handleGoToLogin}>
          건강한 수면관리의 시작
        </Button>
      </ButtonContainer>
    </GradientBackground>
  );
};

export default SignUpSuccessScreen;
