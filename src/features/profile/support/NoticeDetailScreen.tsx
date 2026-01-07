import React from "react";
import styled, { useTheme } from "styled-components/native";
import Header from "../../../shared/components/common/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import { ScrollView } from "react-native";
import Button from "../../../shared/components/common/Button";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  padding: 16px 16px 24px 16px;
`;

const NoticeCategory = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
  margin-bottom: 8px;
`;

const NoticeTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  line-height: 35.2px;
`;

const NoticeContent = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 25.6px;
  padding: 24px 0px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
`;

const ButtonContainer = styled.View`
  padding: 16px;
`;

type NoticeDetailRouteProp = RouteProp<ProfileStackParamList, "NoticeDetail">;

const NoticeDetailScreen = (navigation: any) => {
  const route = useRoute<NoticeDetailRouteProp>();
  const { notice }: any = route.params;

  return (
    <Screen>
      <Header title="공지사항" />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          <NoticeCategory>[공지]</NoticeCategory>
          <NoticeTitle>{notice.TITLE}</NoticeTitle>
          <NoticeContent>{notice.CONTENT}</NoticeContent>
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

export default NoticeDetailScreen;
