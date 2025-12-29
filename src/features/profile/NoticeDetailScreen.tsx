import React from "react";
import styled, { useTheme } from "styled-components/native";
import Header from "../../shared/components/common/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ProfileStackParamList } from "../../app/navigation/RootNavigator";
import { ScrollView } from "react-native";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const Content = styled.View`
  padding: 24px 16px;
`;

const NoticeCategory = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: 12px;
`;

const NoticeTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  line-height: 32px;
`;

const NoticeDate = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray300};
  margin-bottom: 24px;
`;

const NoticeContent = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 25.6px;
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
          {notice.date && <NoticeDate>{notice.date}</NoticeDate>}
          <NoticeContent>{notice.content}</NoticeContent>
        </Content>
      </ScrollableContent>
    </Screen>
  );
};

export default NoticeDetailScreen;










