import React from "react";
import styled, { useTheme } from "styled-components/native";
import Header from "../../../shared/components/common/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import { ScrollView } from "react-native";

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
  color: ${({ theme }) => theme.colors.primary};
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

type NoticeDetailRouteProp = RouteProp<ProfileStackParamList, "NoticeDetail">;

const NoticeDetailScreen = () => {
  const route = useRoute<NoticeDetailRouteProp>();
  const { notice } = route.params;

  return (
    <Screen>
      <Header title="공지사항" />
      <ScrollableContent showsVerticalScrollIndicator={false}>
        <Content>
          <NoticeCategory>[{notice.category}]</NoticeCategory>
          <NoticeTitle>{notice.title}</NoticeTitle>
          <NoticeContent>{notice.content}</NoticeContent>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default NoticeDetailScreen;
