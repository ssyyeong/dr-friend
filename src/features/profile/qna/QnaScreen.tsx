import React, { useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../shared/components/common/Header";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding: 0 16px;
`;

const Content = styled.View`
  flex: 1;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 16px 0;
  margin-right: 16px;
  border-bottom-width: ${({ active }) => (active ? 2 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.text};
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 18px;
  font-weight: 700px;
  color: ${({ active, theme }) =>
    active ? theme.colors.text : theme.colors.gray400};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const QnaList = styled.View`
  margin-bottom: 24px;
`;

const QnaItem = styled.View`
  overflow: hidden;
`;

const QnaHeader = styled.TouchableOpacity<{ expanded: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0px;
`;

const QnaTitle = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const QnaContent = styled.View<{ expanded: boolean }>`
  padding: 20px 16px;
  background-color: ${({ theme }) => theme.colors.gray1000};
  display: ${({ expanded }) => (expanded ? "flex" : "none")};
`;

const QuestionSection = styled.View`
  margin-bottom: 20px;
`;

const QuestionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const QuestionIconText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
`;

const QuestionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const QuestionFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const QuestionDate = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const AnswerSection = styled.View`
  margin-top: 20px;
`;

const AnswerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const AnswerIconText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 8px;
  align-self: flex-start;
`;

const AnswerText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 25.6px;
`;

const AnswerFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const AnswerInfo = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

const DeleteButton = styled.TouchableOpacity`
  padding: 4px 8px;
`;

const DeleteButtonText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const PaginationButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray700};
  align-items: center;
  justify-content: center;
`;

const PageNumber = styled.TouchableOpacity<{ active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
  align-items: center;
  justify-content: center;
  margin: 0 8px;
`;

const PageNumberText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

// Q&A 데이터 타입
type QnaItem = {
  id: number;
  title: string;
  question: string;
  questionDate: string;
  answer?: string;
  answerDate?: string;
  admin?: string;
};

type QnaScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Qna"
>;

const QnaScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<QnaScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<"answered" | "pending">(
    "answered"
  );
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // 샘플 Q&A 데이터 - 답변 완료
  const answeredQnaData: QnaItem[] = [
    {
      id: 1,
      title: "문의 답변은 언제 받을 수 있나요?",
      question: "문의를 남겼는데 답변은 언제 받을 수 있나요?",
      questionDate: "23.07.17 12:23",
      answer:
        "평일 오전 9시~오후 6시 사이 접수된 문의는 24시간 이내에 순차적으로 답변드립니다. 주말 및 공휴일 접수 문의는 다음 영업일에 답변됩니다.",
      answerDate: "23.07.18 12:23",
      admin: "관리자",
    },
    {
      id: 2,
      title: "질문의 제목이 노출됩니다.",
      question: "질문 내용이 여기에 표시됩니다.",
      questionDate: "23.07.15 10:00",
      answer: "답변 내용이 여기에 표시됩니다.",
      answerDate: "23.07.16 14:30",
      admin: "관리자",
    },
    {
      id: 3,
      title: "질문의 제목이 노출됩니다.",
      question: "질문 내용이 여기에 표시됩니다.",
      questionDate: "23.07.14 09:00",
      answer: "답변 내용이 여기에 표시됩니다.",
      answerDate: "23.07.15 11:00",
      admin: "관리자",
    },
  ];

  // 샘플 Q&A 데이터 - 답변 대기
  const pendingQnaData: QnaItem[] = [
    {
      id: 4,
      title: "질문의 제목이 노출됩니다.",
      question: "문의를 남겼는데 답변은 언제 받을 수 있나요?",
      questionDate: "23.07.17 12:23",
    },
    {
      id: 5,
      title: "질문의 제목이 노출됩니다.",
      question: "질문 내용이 여기에 표시됩니다.",
      questionDate: "23.07.16 15:00",
    },
    {
      id: 6,
      title: "질문의 제목이 노출됩니다.",
      question: "질문 내용이 여기에 표시됩니다.",
      questionDate: "23.07.15 16:00",
    },
  ];

  const toggleQna = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const currentData =
    activeTab === "answered" ? answeredQnaData : pendingQnaData;

  const itemsPerPage = 5;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedItems(new Set()); // 페이지 변경 시 아코디언 닫기
    }
  };

  const handleTabChange = (tab: "answered" | "pending") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setExpandedItems(new Set());
  };

  const handleDelete = (id: number) => {
    // 삭제 로직 구현
    console.log("Delete QnA:", id);
  };

  const handleWriteQna = () => {
    // 문의 작성 화면으로 이동
    navigation.navigate("QnaWrite");
  };

  return (
    <Screen>
      <Header
        title="문의하기"
        rightButton={{
          text: "문의작성",
          onPress: handleWriteQna,
        }}
      />
      <ContentWrapper>
        <Content>
          <TabsContainer>
            <Tab
              active={activeTab === "answered"}
              onPress={() => handleTabChange("answered")}
              activeOpacity={0.7}
            >
              <TabText active={activeTab === "answered"}>답변 후</TabText>
            </Tab>
            <Tab
              active={activeTab === "pending"}
              onPress={() => handleTabChange("pending")}
              activeOpacity={0.7}
            >
              <TabText active={activeTab === "pending"}>답변 전</TabText>
            </Tab>
          </TabsContainer>

          <ScrollableContent showsVerticalScrollIndicator={false}>
            <QnaList>
              {paginatedData.map((item) => (
                <QnaItem key={item.id}>
                  <QnaHeader
                    expanded={expandedItems.has(item.id)}
                    onPress={() => toggleQna(item.id)}
                    activeOpacity={0.7}
                  >
                    <QnaTitle>{item.title}</QnaTitle>
                    <Ionicons
                      name={
                        expandedItems.has(item.id)
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={24}
                      color={theme.colors.text}
                    />
                  </QnaHeader>
                  {expandedItems.has(item.id) && (
                    <QnaContent expanded={expandedItems.has(item.id)}>
                      <QuestionSection>
                        <QuestionHeader>
                          <QuestionIconText>Q.</QuestionIconText>
                          <QuestionText>{item.question}</QuestionText>
                        </QuestionHeader>
                        <QuestionFooter>
                          <QuestionDate>{item.questionDate}</QuestionDate>
                          {activeTab === "pending" && (
                            <DeleteButton
                              onPress={() => handleDelete(item.id)}
                              activeOpacity={0.7}
                            >
                              <DeleteButtonText>삭제</DeleteButtonText>
                            </DeleteButton>
                          )}
                        </QuestionFooter>
                      </QuestionSection>

                      {activeTab === "answered" && item.answer && (
                        <AnswerSection>
                          <AnswerHeader>
                            <AnswerIconText>A.</AnswerIconText>
                            <AnswerText>{item.answer}</AnswerText>
                          </AnswerHeader>
                          <AnswerFooter>
                            <AnswerInfo>{item.admin}</AnswerInfo>
                            <QuestionDate>{item.answerDate}</QuestionDate>
                          </AnswerFooter>
                        </AnswerSection>
                      )}
                    </QnaContent>
                  )}
                </QnaItem>
              ))}
            </QnaList>
          </ScrollableContent>
        </Content>
        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              disabled={currentPage === 1}
              onPress={() => handlePageChange(currentPage - 1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.text}
              />
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PageNumber
                key={page}
                active={currentPage === page}
                onPress={() => handlePageChange(page)}
                activeOpacity={0.7}
              >
                <PageNumberText>{page}</PageNumberText>
              </PageNumber>
            ))}
            <PaginationButton
              disabled={currentPage === totalPages}
              onPress={() => handlePageChange(currentPage + 1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text}
              />
            </PaginationButton>
          </PaginationContainer>
        )}
      </ContentWrapper>
    </Screen>
  );
};

export default QnaScreen;
