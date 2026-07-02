import React from "react";
import styled from "styled-components/native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { CareStackParamList } from "../../app/navigation/RootNavigator";
import Header from "../../shared/components/common/Header";
import Button from "../../shared/components/common/Button";
import { Image, View } from "react-native";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const ThumbnailContainer = styled.View`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const ThumbnailImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Content = styled.View`
  padding: 24px 16px;
`;

const Category = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  line-height: 33px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: 24px;
`;

const ContentText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 26px;
`;

const ButtonContainer = styled.View`
  padding: 16px;
`;

type HealthStoryDetailRouteProp = RouteProp<
  CareStackParamList,
  "HealthStoryDetail"
>;

const HealthStoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<HealthStoryDetailRouteProp>();
  const { item } = route.params;

  return (
    <Screen>
      <Header title="" />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        {item.image && (
          <ThumbnailContainer>
            <ThumbnailImage source={item.image} resizeMode="cover" />
          </ThumbnailContainer>
        )}
        <Content>
          <Category>{item.category}</Category>
          <Title>{item.title}</Title>
          <Divider />
          <ContentText>
            {item.content ||
              `이 콘텐츠는 "${item.title}"에 대한 상세 내용입니다.\n\n수면과 건강에 관한 유익한 정보를 제공합니다. 꾸준한 수면 관리를 통해 건강한 생활을 유지하세요.\n\n더 많은 정보는 앱 내 다른 콘텐츠를 참고해 주세요.`}
          </ContentText>
        </Content>
      </ScrollableContent>
      <ButtonContainer>
        <Button variant="transparent" onPress={() => navigation.goBack()}>
          목록으로
        </Button>
      </ButtonContainer>
    </Screen>
  );
};

export default HealthStoryDetailScreen;
