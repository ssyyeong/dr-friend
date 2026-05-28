import React, { useState } from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "../../../shared/components/common/SafeAreaView";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import { Ionicons } from "@expo/vector-icons";
import SelfTestBackgroundSvg from "../../../../assets/image/self-test-background.svg";
import MessageSvg from "../../../../assets/icon/message.svg";
import Svg, {
  Text,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

type Props = NativeStackScreenProps<AuthStackParamList, "SelfTest">;

const Screen = styled(SafeAreaView)`
  flex: 1;
`;

const BackgroundContainer = styled.View`
  width: 100%;
  min-height: 812px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const BackgroundContent = styled.View`
  width: 100%;
  min-height: 812px;
  justify-content: center;
  align-items: center;
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
`;

const InnerContent = styled.View`
  padding: 40px 16px 24px;
  align-items: center;
`;

const MainTitleContainer = styled.View`
  align-items: center;
  margin-bottom: 24px;
  justify-content: center;
  width: 100%;
`;

const GradientTextContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const SubtitleContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 32px;
`;

const StartButtonContainer = styled.View`
  width: 343px;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const InfoBoxContainer = styled.View`
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
`;

const InfoBoxGradient = styled(LinearGradient)`
  border-radius: 16px;
  padding: 20px;
  align-items: center;
`;

const InfoBoxBlur = styled(BlurView)`
  border-radius: 16px;
  overflow: hidden;
`;

const InfoText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 25.6px;
  letter-spacing: -0.16px;
`;

const NotesContainer = styled.View`
  width: 100%;
  padding-horizontal: 24px;
  padding-top: 40px;
  padding-bottom: 60px;
`;

const NotesTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray200};
  margin-bottom: 20px;
`;

const NotesItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const NotesText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray300};
  line-height: 25.6px;
`;

const SelfTestScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const textWidth = screenWidth - 32; // 패딩 제외

  const handleStart = () => {
    (navigation as any).navigate("SurveyQuestion", { id: route.params?.id });
  };

  return (
    <Screen>
      <ScrollableContent
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <BackgroundContent>
          <BackgroundContainer>
            <SelfTestBackgroundSvg
              width={Dimensions.get("window").width}
              height={812}
              preserveAspectRatio="xMidYMid slice"
            />
          </BackgroundContainer>
          <InnerContent>
            <MainTitleContainer>
              <GradientTextContainer>
                <Svg height="40" width={textWidth}>
                  <Defs>
                    <SvgLinearGradient
                      id="textGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <Stop offset="0%" stopColor="#7353FF" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#25C3FB" stopOpacity="1" />
                    </SvgLinearGradient>
                  </Defs>
                  <Text
                    x={textWidth / 2}
                    y="30"
                    fontSize="32"
                    fontWeight="700"
                    textAnchor="middle"
                    fill="url(#textGradient)"
                  >
                    나의 수면건강 진단하기
                  </Text>
                </Svg>
              </GradientTextContainer>
            </MainTitleContainer>

            <SubtitleContainer>
              <Subtitle>
                더 나은 수면, 첫 걸음은{"\n"}내 수면 상태를 아는 것입니다.
              </Subtitle>
            </SubtitleContainer>

            <StartButtonContainer>
              <Button variant="gradient" onPress={handleStart}>
                시작
              </Button>
            </StartButtonContainer>

            <InfoBoxContainer>
              <InfoBoxBlur intensity={4} tint="dark">
                <InfoBoxGradient
                  colors={["rgba(0, 0, 0, 0.30)", "rgba(0, 0, 0, 0.10)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <MessageSvg
                    width={24}
                    height={24}
                    style={{ marginBottom: 12 }}
                  />
                  <InfoText>
                    문항은 총 30문항이며 최근 4주간의{"\n"}나의 평균적인 상태를
                    떠올리며{"\n"}
                    응답해 주시면 됩니다.
                  </InfoText>
                </InfoBoxGradient>
              </InfoBoxBlur>
            </InfoBoxContainer>
          </InnerContent>
        </BackgroundContent>

        <Content>
          <NotesContainer>
            <NotesTitle>참고사항</NotesTitle>
            <NotesItem>
              <NotesText>
                • 이 기능은 내 수면 상태를 스스로 확인해보는 참고용 자료이며,
                병원의 정식 진단을 대신할 수는 없습니다.
              </NotesText>
            </NotesItem>
            <NotesItem>
              <NotesText>
                • 증상이 심하거나 일상생활에 불편이 크다면, 전문가와
                상담해보시는 것이 좋습니다. 예를 들어 낮에 너무 졸려 운전이
                어렵거나, 자는 동안 숨이 멈추는 것이 의심될 때는 상담을
                권합니다.
              </NotesText>
            </NotesItem>
            <NotesItem>
              <NotesText>
                • 이 설문은 널리 사용되는 수면 관련 검사 내용을 바탕으로 다시
                구성한 것으로, 결과는 참고용 안내이며 실제 진단 결과는 아닙니다.
              </NotesText>
            </NotesItem>
          </NotesContainer>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default SelfTestScreen;
