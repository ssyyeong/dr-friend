import React, { useState } from "react";
import styled from "styled-components/native";
import { ScrollView, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import CareSection from "./components/CareSection";
import Header from "../../shared/components/common/Header";

type NavigationProp = NativeStackNavigationProp<CareStackParamList, "Care">;

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled(ScrollView)`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px;
`;

const HeaderGradientBackground = styled(LinearGradient)`
  padding-bottom: 48px;
  padding-top: 16px;
`;

const HeaderContainer = styled.View`
  padding: 16px;
  padding-top: 66px;
`;

const TitleContainer = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
  line-height: 28.8px;
`;

const MainButtonContainer = styled.TouchableOpacity`
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;

const GradientBackground = styled(LinearGradient)`
  height: 56px;
  align-items: center;
  justify-content: center;
`;

const MainButtonText = styled.Text`
  font-size: 19px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const CareScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>("소리");
  const screenWidth = Dimensions.get("window").width;
  const titleWidth = screenWidth - 48; // padding 고려

  // 임시 데이터 - 실제 API에서 가져와야 함
  const sleepHelpItems = [
    { id: "1", image: null, title: "싱잉볼 테라피" },
    { id: "2", image: null, title: "피아노" },
  ];

  const healthStoryItems = [
    { id: "1", image: null, title: "그라운딩, 어싱 이란?" },
    { id: "2", image: null, title: "꿀잠, 꿀팁" },
  ];

  const medicalDeviceItems = [
    { id: "1", image: null, title: "어싱 닥터프렌드(매트)" },
    { id: "2", image: null, title: "뉴슬립패드" },
  ];

  const categories = ["소리", "음악", "호흡", "스트레칭"];

  return (
    <Screen>
      <ScrollableContent>
        <HeaderGradientBackground
          colors={["#09182C", "#161B45", "#1F587D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.5, 1]}
        >
          <HeaderContainer>
            <TitleContainer>
              <Name>김닥프</Name>
              <Title>님의 맞춤 수면 루틴</Title>
            </TitleContainer>
            <Subtitle>
              더 나은 수면, 첫 걸음은 내 수면 상태를 아는 것입니다.
            </Subtitle>
            <MainButtonContainer
              onPress={() => {
                // 수면 건강 진단하기 버튼 액션
              }}
              activeOpacity={0.8}
            >
              <GradientBackground
                colors={["#7353FF", "#25C3FB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MainButtonText>나의 수면 건강 진단하기</MainButtonText>
              </GradientBackground>
            </MainButtonContainer>
          </HeaderContainer>
        </HeaderGradientBackground>
        <Content>
          <CareSection
            title="수면을 위한 도움"
            description="수면을 위한 사운드로 편안히 주무세요."
            items={sleepHelpItems}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onMorePress={() =>
              navigation.navigate("SleepHelpList", {
                category: selectedCategory,
              })
            }
          />

          <Divider />

          <CareSection
            title="건강 이야기"
            description={`수면과 건강에 대한 올바른 정보와
다양한 이야기를 만나보세요.`}
            items={healthStoryItems}
            onMorePress={() => navigation.navigate("HealthStoryList")}
          />
          <Divider />

          <CareSection
            title="수면 의료기기"
            description={`닥터프렌드 제품과 함께하는 체계적인 수면 케어를
제공합니다.`}
            items={medicalDeviceItems}
            onMorePress={() => navigation.navigate("MedicalDeviceList")}
          />
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default CareScreen;
