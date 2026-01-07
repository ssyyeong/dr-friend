import React, { useCallback, useEffect, useState, useMemo } from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../shared/components/common/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";
import Controller from "../../../services/controller";
import { getMemberId } from "../../../services/authService";

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
  const [answeredPage, setAnsweredPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [qnaAnsweredData, setQnaAnsweredData] = useState<any[]>([]);
  const [qnaPendingData, setQnaPendingData] = useState<any[]>([]);
  const [answeredTotalPages, setAnsweredTotalPages] = useState(0);
  const [pendingTotalPages, setPendingTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const toggleQna = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const fetchQnaData = useCallback(async () => {
    try {
      setLoading(true);
      const memberId = await getMemberId();
      if (!memberId) {
        setLoading(false);
        return;
      }

      const controller = new Controller({
        modelName: "QnaBoardQuestion",
        modelId: "qna_board_question",
      });
      const response = await controller.findAll({
        APP_MEMBER_IDENTIFICATION_CODE: memberId,
      });

      if (response?.status === 200 && response?.result?.rows) {
        const answered: any[] = [];
        const pending: any[] = [];

        response.result.rows.forEach((item: any) => {
          if (item.QnaBoardAnswers && item.QnaBoardAnswers.length > 0) {
            answered.push(item);
          } else {
            pending.push(item);
          }
        });

        setQnaAnsweredData(answered);
        setQnaPendingData(pending);
        setAnsweredTotalPages(Math.ceil(answered.length / 10));
        setPendingTotalPages(Math.ceil(pending.length / 10));
      }
    } catch (error) {
      console.error("QnA 데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면 포커스 시 데이터 불러오기
  useFocusEffect(
    useCallback(() => {
      fetchQnaData();
    }, [fetchQnaData])
  );

  // 현재 탭에 따른 데이터와 페이지네이션
  const currentData = useMemo(() => {
    return activeTab === "answered" ? qnaAnsweredData : qnaPendingData;
  }, [activeTab, qnaAnsweredData, qnaPendingData]);

  const currentPage = useMemo(() => {
    return activeTab === "answered" ? answeredPage : pendingPage;
  }, [activeTab, answeredPage, pendingPage]);

  const totalPages = useMemo(() => {
    return activeTab === "answered" ? answeredTotalPages : pendingTotalPages;
  }, [activeTab, answeredTotalPages, pendingTotalPages]);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (activeTab === "answered") {
        setAnsweredPage(page);
      } else {
        setPendingPage(page);
      }
      setExpandedItems(new Set()); // 페이지 변경 시 아코디언 닫기
    }
  };

  const handleTabChange = (tab: "answered" | "pending") => {
    setActiveTab(tab);
    if (tab === "answered") {
      setAnsweredPage(1);
    } else {
      setPendingPage(1);
    }
    setExpandedItems(new Set());
  };

  const handleDelete = async (id: number) => {
    const controller = new Controller({
      modelName: "QnaBoardQuestion",
      modelId: "qna_board_question",
    });
    const response = await controller.delete({
      QNA_BOARD_QUESTION_IDENTIFICATION_CODE: id,
    });
    if (response?.status === 200) {
      fetchQnaData();
    }
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
              activeOpacity={1}
            >
              <TabText active={activeTab === "answered"}>답변 후</TabText>
            </Tab>
            <Tab
              active={activeTab === "pending"}
              onPress={() => handleTabChange("pending")}
              activeOpacity={1}
            >
              <TabText active={activeTab === "pending"}>답변 전</TabText>
            </Tab>
          </TabsContainer>

          <ScrollableContent showsVerticalScrollIndicator={false}>
            {loading ? (
              <QnaList>
                <QnaTitle style={{ textAlign: "center", padding: 40 }}>
                  로딩 중...
                </QnaTitle>
              </QnaList>
            ) : paginatedData.length === 0 ? (
              <QnaList>
                <QnaTitle style={{ textAlign: "center", padding: 40 }}>
                  {activeTab === "answered"
                    ? "답변된 문의가 없습니다."
                    : "답변 대기 중인 문의가 없습니다."}
                </QnaTitle>
              </QnaList>
            ) : (
              <QnaList>
                {paginatedData.map((item: any) => {
                  const answer =
                    item.QnaBoardAnswers && item.QnaBoardAnswers.length > 0
                      ? item.QnaBoardAnswers[0]
                      : null;
                  return (
                    <QnaItem key={item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE}>
                      <QnaHeader
                        expanded={expandedItems.has(
                          item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE
                        )}
                        onPress={() =>
                          toggleQna(item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE)
                        }
                        activeOpacity={1}
                      >
                        <QnaTitle>{item.TITLE}</QnaTitle>
                        <Ionicons
                          name={
                            expandedItems.has(
                              item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE
                            )
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          size={24}
                          color={theme.colors.text}
                        />
                      </QnaHeader>
                      {expandedItems.has(
                        item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE
                      ) && (
                        <QnaContent
                          expanded={expandedItems.has(
                            item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE
                          )}
                        >
                          <QuestionSection>
                            <QuestionHeader>
                              <QuestionIconText>Q.</QuestionIconText>
                              <QuestionText>{item.CONTENT}</QuestionText>
                            </QuestionHeader>
                            <QuestionFooter>
                              <QuestionDate>
                                {formatDate(item.CREATED_AT)}
                              </QuestionDate>
                              {activeTab === "pending" && (
                                <DeleteButton
                                  onPress={() =>
                                    handleDelete(
                                      item.QNA_BOARD_QUESTION_IDENTIFICATION_CODE
                                    )
                                  }
                                  activeOpacity={1}
                                >
                                  <DeleteButtonText>삭제</DeleteButtonText>
                                </DeleteButton>
                              )}
                            </QuestionFooter>
                          </QuestionSection>

                          {activeTab === "answered" && answer && (
                            <AnswerSection>
                              <AnswerHeader>
                                <AnswerIconText>A.</AnswerIconText>
                                <AnswerText>{answer.CONTENT}</AnswerText>
                              </AnswerHeader>
                              <AnswerFooter>
                                <AnswerInfo>관리자</AnswerInfo>
                                <QuestionDate>
                                  {formatDate(answer.CREATED_AT)}
                                </QuestionDate>
                              </AnswerFooter>
                            </AnswerSection>
                          )}
                        </QnaContent>
                      )}
                    </QnaItem>
                  );
                })}
              </QnaList>
            )}
          </ScrollableContent>
        </Content>
        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              disabled={currentPage === 1}
              onPress={() => handlePageChange(currentPage - 1)}
              activeOpacity={1}
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
                activeOpacity={1}
              >
                <PageNumberText>{page}</PageNumberText>
              </PageNumber>
            ))}
            <PaginationButton
              disabled={currentPage === totalPages}
              onPress={() => handlePageChange(currentPage + 1)}
              activeOpacity={1}
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
