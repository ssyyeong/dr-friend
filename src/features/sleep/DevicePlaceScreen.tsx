import React from "react";
import styled, { useTheme } from "styled-components/native";
import Button from "../../shared/components/common/Button";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: 40px 24px 24px;
  justify-content: space-between;
`;

const IllustrationContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CircularImageWrapper = styled.View`
  width: 240px;
  height: 240px;
  border-radius: 140px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
`;

const InstructionText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 28px;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.View`
  width: 100%;
`;

const DevicePlaceScreen = () => {
  return (
    <Screen>
      <Content>
        <IllustrationContainer>
          <CircularImageWrapper>
            {React.createElement(
              require("../../../assets/image/device-placement.svg").default ||
                require("../../../assets/image/device-placement.svg"),
              { width: 280, height: 280 }
            )}
          </CircularImageWrapper>
          <InstructionText>
            예시와 같이 기기를 배치합니다. {"\n"} 충전기는 연결 상태로 둡니다.
          </InstructionText>
        </IllustrationContainer>

        <ButtonContainer>
          <Button variant="primary" onPress={() => {}}>
            확인
          </Button>
        </ButtonContainer>
      </Content>
    </Screen>
  );
};

export default DevicePlaceScreen;
