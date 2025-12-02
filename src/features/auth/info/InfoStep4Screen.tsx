import React, { useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import ToggleSwitch from "../../../shared/components/common/ToggleSwitch";
import ProgressIndicator from "./ProgressIndicator";
type Props = NativeStackScreenProps<AuthStackParamList, "InfoStep4">;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Screen = styled.SafeAreaView`
  flex: 1;
  padding: 24px 16px;
`;

const Content = styled.View`
  flex: 1;
  width: 100%;
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 36px;
  letter-spacing: -0.22px;
  line-height: 35.2px;
`;

const PermissionCard = styled.View`
  background-color: rgba(79, 107, 145, 0.24);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  margin-bottom: 12px;
`;

const PermissionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PermissionTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const PermissionDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
`;

const SetLaterLink = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: 24px;
`;

const SetLaterText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  text-decoration-line: underline;
`;

const ButtonContainer = styled.View`
  width: 100%;
`;

const InfoStep4Screen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSetLater = () => {
    // 나중에 설정 - 다음 단계로 이동
    // TODO: 실제 다음 단계로 변경 필요
    navigation.navigate("SelfTest");
  };

  const handleAllowAll = () => {
    setMicrophoneEnabled(true);
    setNotificationsEnabled(true);
    // TODO: 실제 권한 요청 로직 및 다음 단계로 이동
  };

  return (
    <GradientBackground
      colors={["#0C1D33", "#182E4B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Screen>
        <Content>
          <ProgressIndicator currentStep={4} />

          <ScrollableContent showsVerticalScrollIndicator={false}>
            <Title>
              앱의 원활한 활용을 위해{"\n"}
              권한이 필요합니다.
            </Title>

            <PermissionCard>
              <PermissionHeader>
                <PermissionTitle>마이크</PermissionTitle>
                <ToggleSwitch
                  value={microphoneEnabled}
                  onValueChange={setMicrophoneEnabled}
                  size="medium"
                />
              </PermissionHeader>
              <PermissionDescription>
                마이크를 사용하여 코골이,잠꼬대 녹음이{"\n"}가능합니다.
              </PermissionDescription>
            </PermissionCard>

            <PermissionCard>
              <PermissionHeader>
                <PermissionTitle>알림</PermissionTitle>
                <ToggleSwitch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  size="medium"
                />
              </PermissionHeader>
              <PermissionDescription>
                앱으로 알림을 보내도록 합니다.
              </PermissionDescription>
            </PermissionCard>
          </ScrollableContent>
        </Content>

        <SetLaterLink onPress={handleSetLater}>
          <SetLaterText>나중에 설정</SetLaterText>
        </SetLaterLink>
        <ButtonContainer>
          <Button variant="primary" onPress={handleAllowAll}>
            모두 허용
          </Button>
        </ButtonContainer>
      </Screen>
    </GradientBackground>
  );
};

export default InfoStep4Screen;
