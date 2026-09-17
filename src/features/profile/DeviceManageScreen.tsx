import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import Header from "../../shared/components/common/Header";
import ToggleSwitch from "../../shared/components/common/ToggleSwitch";
import { loginWithFitbit, logout, isLoggedIn } from "../../services/fitbitAuth";
import { Alert } from "react-native";

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

const DeviceCard = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px;
  margin-bottom: 12px;
`;

const DeviceHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DeviceTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DeviceDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
  line-height: 25.6px;
`;

const StatusText = styled.Text<{ connected: boolean }>`
  font-size: 14px;
  color: ${({ theme, connected }) =>
    connected ? theme.colors.primary : theme.colors.gray400};
  margin-top: 8px;
`;

const DeviceManageScreen = () => {
  const [fitbitConnected, setFitbitConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFitbitConnection();
  }, []);

  const checkFitbitConnection = async () => {
    try {
      const connected = await isLoggedIn();
      setFitbitConnected(connected);
    } catch (error) {
      console.error("Fitbit 연결 상태 확인 실패:", error);
    }
  };

  const handleFitbitToggle = async (value: boolean) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (value) {
        await loginWithFitbit();
        setFitbitConnected(true);
        Alert.alert("연결 완료", "Fitbit 계정이 연결되었습니다.");
      } else {
        await logout();
        setFitbitConnected(false);
        Alert.alert("연결 해제", "Fitbit 계정 연결이 해제되었습니다.");
      }
    } catch (error: any) {
      console.error("Fitbit 연동 실패:", error);
      Alert.alert("연결 실패", error?.message || "Fitbit 연동에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="기기 연결 관리" showBackButton={true} />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          <DeviceCard>
            <DeviceHeader>
              <DeviceTitle>Fitbit</DeviceTitle>
              <ToggleSwitch
                value={fitbitConnected}
                onValueChange={handleFitbitToggle}
                size="medium"
              />
            </DeviceHeader>
            <DeviceDescription>
              Fitbit 계정을 연결하여 수면 데이터를 자동으로 가져올 수 있습니다.
            </DeviceDescription>
            <StatusText connected={fitbitConnected}>
              {fitbitConnected ? "연결됨" : "연결 안됨"}
            </StatusText>
          </DeviceCard>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default DeviceManageScreen;
