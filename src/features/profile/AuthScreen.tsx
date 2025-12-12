import React, { useState } from "react";
import styled from "styled-components/native";
import Header from "../../shared/components/common/Header";
import ToggleSwitch from "../../shared/components/common/ToggleSwitch";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px;
`;

const PermissionCard = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
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
  line-height: 25.6px;
`;

const AuthScreen = () => {
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  return (
    <Screen>
      <Header title="권한 관리" showBackButton={true} />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
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
              마이크를 사용하여 코골이,잠꼬대 녹음이 가능합니다.
            </PermissionDescription>
          </PermissionCard>

          <PermissionCard>
            <PermissionHeader>
              <PermissionTitle>알림</PermissionTitle>
              <ToggleSwitch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                size="medium"
              />
            </PermissionHeader>
            <PermissionDescription>
              앱으로 알림을 보내도록 합니다.
            </PermissionDescription>
          </PermissionCard>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default AuthScreen;
