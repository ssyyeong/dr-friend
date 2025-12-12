import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import Button from "../../shared/components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SleepStackParamList } from "../../app/navigation/RootNavigator";

// SVG 컴포넌트를 컴포넌트 외부에서 미리 로드
const DevicePlacementSvg =
  require("../../../assets/image/device-placement.svg").default ||
  require("../../../assets/image/device-placement.svg");

type SleepScreenNavigationProp = NativeStackNavigationProp<
  SleepStackParamList,
  "Sleep"
>;

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
  const navigation = useNavigation<SleepScreenNavigationProp>();
  const [isSvgReady, setIsSvgReady] = useState(false);

  useEffect(() => {
    // SVG가 로드될 때까지 약간의 지연을 두어 안정적으로 렌더링
    const timer = setTimeout(() => {
      setIsSvgReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Screen>
      <Content>
        <IllustrationContainer>
          <CircularImageWrapper>
            {isSvgReady &&
              React.createElement(DevicePlacementSvg, {
                width: 240,
                height: 240,
              })}
          </CircularImageWrapper>
          <InstructionText>
            예시와 같이 기기를 배치합니다. {"\n"} 충전기는 연결 상태로 둡니다.
          </InstructionText>
        </IllustrationContainer>

        <ButtonContainer>
          <Button
            variant="primary"
            onPress={() => {
              navigation.navigate("Alarm");
            }}
          >
            확인
          </Button>
        </ButtonContainer>
      </Content>
    </Screen>
  );
};

export default DevicePlaceScreen;
