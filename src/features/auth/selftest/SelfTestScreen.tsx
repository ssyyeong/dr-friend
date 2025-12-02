import React, { useState } from "react";
import { Image, Dimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { AuthStackParamList } from "../../../app/navigation/RootNavigator";
import Button from "../../../shared/components/common/Button";
import { Ionicons } from "@expo/vector-icons";
import Svg, {
  Text,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

type Props = NativeStackScreenProps<AuthStackParamList, "SelfTest">;

const Screen = styled.SafeAreaView`
  flex: 1;
`;

const BackgroundImage = styled.ImageBackground`
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
  width: 100%;
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

const SelfTestScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const textWidth = screenWidth - 32; // 패딩 제외

  const handleStart = () => {
    // TODO: 실제 설문 시작 화면으로 이동
  };

  return (
    <Screen>
      <ScrollableContent
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <BackgroundImage
          source={require("../../../../assets/image/self-test-background.svg")}
          resizeMode="cover"
        >
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
                  <Image
                    source={require("../../../../assets/icon/message.svg")}
                    resizeMode="contain"
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
        </BackgroundImage>

        <Content>
          <NotesContainer>
            <NotesTitle>참고사항</NotesTitle>
            <NotesItem>
              <NotesText>
                • 이 도구는 자가 점검용 참고 자료이며, 병원에서 받는 정식 진단을
                대신하지 않습니다.
              </NotesText>
            </NotesItem>
            <NotesItem>
              <NotesText>
                • 만약 증상이 심하거나 일상에 위험이 있다면 (예: 낮 동안
                졸음으로 운전이 어려움, 수면 중 무호흡 의심) 꼭 전문가와
                상담하세요.
              </NotesText>
            </NotesItem>
            <NotesItem>
              <NotesText>
                • 본 설문은 국제적으로 사용되는 주요 검사(PSQI, ESS, ISI-K,
                BEPSI)를 참고하여 재구성한 것이며, 결과 해석은 실제 진단이 아닌
                가이드용임을 알려드립니다.
              </NotesText>
            </NotesItem>
          </NotesContainer>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default SelfTestScreen;
