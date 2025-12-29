import React from "react";
import styled from "styled-components/native";
import Button from "../../shared/components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SleepStackParamList } from "../../app/navigation/RootNavigator";
import DevicePlacementSvg from "../../../assets/image/device-placement.svg";

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

  return (
    <Screen>
      <Content>
        <IllustrationContainer>
          <CircularImageWrapper>
            <DevicePlacementSvg width={240} height={240} />
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
