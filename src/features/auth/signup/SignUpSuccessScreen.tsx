import React from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";

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

const CheckIcon = styled.Image`
  margin-bottom: 36px;
  width: 100px;
  height: 100px;
  resize-mode: contain;
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
  width: 100%;
  margin-bottom: 24px;
  padding-left: 16px;
  padding-right: 16px;
`;

const SignUpSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const handleGoToLogin = () => {
    navigation.navigate("InfoStep1");
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <CheckIcon
            source={require("../../../../assets/icon/round-check.svg")}
            resizeMode="contain"
          />
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
