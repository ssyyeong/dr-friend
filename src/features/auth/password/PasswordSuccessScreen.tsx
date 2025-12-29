import React from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import RoundCheckSvg from "../../../../assets/icon/round-check.svg";

type Props = NativeStackScreenProps<AuthStackParamList, "PasswordSuccess">;

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
  width: 100%;
  margin-bottom: 24px;
  padding-left: 16px;
  padding-right: 16px;
`;

const PasswordSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const handleGoToLogin = () => {
    navigation.navigate("Login");
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
          <Title>비밀번호 재설정 완료</Title>
          <Description>
            비밀번호가 변경 되었습니다.{`\n`}로그인 해주세요.
          </Description>
        </Content>
      </Screen>
      <ButtonContainer>
        <Button variant="primary" onPress={handleGoToLogin}>
          로그인
        </Button>
      </ButtonContainer>
    </GradientBackground>
  );
};

export default PasswordSuccessScreen;
