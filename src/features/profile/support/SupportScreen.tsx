import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../shared/components/common/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";

import Controller from "../../../services/controller";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.View`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  padding: 0 16px;
  margin-bottom: 16px;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 16px 0;
  margin-right: 16px;
  border-bottom-width: ${({ active }) => (active ? 2 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.gray100};
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ active, theme }) =>
    active ? theme.colors.text : theme.colors.gray400};
`;

const ScrollableContent = styled.ScrollView`
  flex: 1;
`;

const CategoryFilterContainer = styled.ScrollView`
  flex-direction: row;
  padding: 0 16px;
  margin-bottom: 16px;
`;

const CategoryChip = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.gray700};
  margin-right: 8px;
`;

const CategoryChipText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const FAQList = styled.View`
  margin-bottom: 24px;
`;

const FAQItem = styled.View`
  overflow: hidden;
`;

const FAQCategory = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 8px;
  font-weight: 500;
`;

const FAQHeader = styled.TouchableOpacity<{ expanded: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const NoticeList = styled.View`
  margin-bottom: 24px;
`;

const NoticeItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray700};
`;

const NoticeItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const NoticeCategory = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
  font-weight: 500;
`;

const NoticeTitle = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const FAQTitle = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const FAQContent = styled.View<{ expanded: boolean }>`
  padding: 20px 16px;
  background-color: ${({ theme }) => theme.colors.gray1000};
  display: ${({ expanded }) => (expanded ? "flex" : "none")};
`;

const FAQContentText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 25.6px;
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

// FAQ 데이터 타입
type FAQItem = {
  id: number;
  category: string;
  title: string;
  content: string;
};

// 공지사항 데이터 타입
type NoticeItem = {
  id: number;
  category: string;
  title: string;
  content: string;
  date?: string;
};

type SupportScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "Support"
>;

const SupportScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SupportScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<"faq" | "notice">("faq");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const [faqCategories, setFaqCategories] = useState<string[]>([]);
  const [faqAllData, setFaqAllData] = useState<FAQItem[]>([]);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const [noticeData, setNoticeData] = useState<NoticeItem[]>([]);
  const [faqCurrentPage, setFaqCurrentPage] = useState(1);
  const [noticeCurrentPage, setNoticeCurrentPage] = useState(1);

  const filteredFAQ =
    selectedCategory === "전체"
      ? faqData
      : faqData.filter((item: any) => item.CATEGORY === selectedCategory);

  const itemsPerPage = 5;
  const faqTotalPages = Math.ceil(filteredFAQ.length / itemsPerPage);
  const faqStartIndex = (faqCurrentPage - 1) * itemsPerPage;
  const faqEndIndex = faqStartIndex + itemsPerPage;
  const paginatedFAQ = filteredFAQ.slice(faqStartIndex, faqEndIndex);

  const noticeTotalPages = Math.ceil(noticeData.length / itemsPerPage);
  const noticeStartIndex = (noticeCurrentPage - 1) * itemsPerPage;
  const noticeEndIndex = noticeStartIndex + itemsPerPage;
  const paginatedNotice = noticeData.slice(noticeStartIndex, noticeEndIndex);

  const fetchNoticeData = useCallback(async () => {
    try {
      const controller = new Controller({
        modelName: "NoticeBoardContent",
        modelId: "notice_board_content",
      });
      const response = await controller.findAll({
        PAGE: noticeCurrentPage - 1,
        LIMIT: 10,
      });
      if (response?.status === 200) {
        setNoticeData(response.result.rows);
      }
    } catch (error) {
      console.error("공지사항 데이터 불러오기 실패:", error);
    }
  }, [noticeCurrentPage]);

  const fetchFaqData = useCallback(async () => {
    try {
      const controller = new Controller({
        modelName: "FaqBoardContent",
        modelId: "faq_board_content",
      });
      const response = await controller.findAll({
        PAGE: faqCurrentPage - 1,
        LIMIT: 10,
      });

      if (response?.status === 200) {
        setFaqCategories([
          "전체",
          ...response.result.categoryList.map(
            (category: any) => category.CATEGORY
          ),
        ]);
        setFaqAllData(response.result.rows);
        setFaqData(response.result.rows);
      }
    } catch (error) {
      console.error("FAQ 데이터 불러오기 실패:", error);
    }
  }, [faqCurrentPage]);

  // 화면 포커스 시 데이터 불러오기
  useFocusEffect(
    useCallback(() => {
      fetchNoticeData();
      fetchFaqData();
    }, [fetchNoticeData, fetchFaqData])
  );

  // 페이지 변경 시 데이터 다시 불러오기
  useEffect(() => {
    fetchNoticeData();
  }, [noticeCurrentPage, fetchNoticeData]);

  useEffect(() => {
    fetchFaqData();
  }, [faqCurrentPage, fetchFaqData]);

  const filteredFaqData = useCallback(
    (category: string) => {
      if (category === "전체") {
        return faqAllData;
      }
      return faqAllData.filter((item: any) => item.CATEGORY === category);
    },
    [faqAllData]
  );

  const toggleFAQ = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleFaqPageChange = (page: number) => {
    if (page >= 1 && page <= faqTotalPages) {
      setFaqCurrentPage(page);
      setExpandedItems(new Set()); // 페이지 변경 시 아코디언 닫기
    }
  };

  const handleNoticePageChange = (page: number) => {
    if (page >= 1 && page <= noticeTotalPages) {
      setNoticeCurrentPage(page);
      setExpandedItems(new Set()); // 페이지 변경 시 아코디언 닫기
    }
  };

  const handleTabChange = (tab: "faq" | "notice") => {
    setActiveTab(tab);
    setFaqCurrentPage(1);
    setNoticeCurrentPage(1);
    setExpandedItems(new Set());
  };

  return (
    <Screen>
      <Header title="고객센터" />
      <ContentWrapper>
        <Content>
          <TabsContainer>
            <Tab
              active={activeTab === "faq"}
              onPress={() => handleTabChange("faq")}
              activeOpacity={1}
            >
              <TabText active={activeTab === "faq"}>자주묻는 질문</TabText>
            </Tab>
            <Tab
              active={activeTab === "notice"}
              onPress={() => handleTabChange("notice")}
              activeOpacity={1}
            >
              <TabText active={activeTab === "notice"}>공지 사항</TabText>
            </Tab>
          </TabsContainer>

          {activeTab === "faq" && (
            <ScrollableContent showsVerticalScrollIndicator={false}>
              <CategoryFilterContainer
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {faqCategories.map((category) => (
                  <CategoryChip
                    key={category}
                    selected={selectedCategory === category}
                    onPress={() => {
                      setSelectedCategory(category);
                      setFaqData(filteredFaqData(category));
                      setFaqCurrentPage(1);
                      setExpandedItems(new Set());
                    }}
                    activeOpacity={1}
                  >
                    <CategoryChipText>{category}</CategoryChipText>
                  </CategoryChip>
                ))}
              </CategoryFilterContainer>

              <FAQList>
                {paginatedFAQ.map((item: any) => (
                  <FAQItem key={item.FAQ_BOARD_CONTENT_IDENTIFICATION_CODE}>
                    <FAQHeader
                      expanded={expandedItems.has(
                        item.FAQ_BOARD_CONTENT_IDENTIFICATION_CODE
                      )}
                      onPress={() =>
                        toggleFAQ(item.FAQ_BOARD_CONTENT_IDENTIFICATION_CODE)
                      }
                      activeOpacity={1}
                    >
                      <FAQCategory>[{item.CATEGORY}]</FAQCategory>
                      <FAQTitle>{item.TITLE}</FAQTitle>
                      <Ionicons
                        name={
                          expandedItems.has(
                            item.FAQ_BOARD_CONTENT_IDENTIFICATION_CODE
                          )
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={24}
                        color={theme.colors.text}
                      />
                    </FAQHeader>
                    {expandedItems.has(
                      item.FAQ_BOARD_CONTENT_IDENTIFICATION_CODE
                    ) && (
                      <FAQContent
                        expanded={expandedItems.has(
                          item.FAQ_BOARD_CONTENT_IDENTIFICATION_CODE
                        )}
                      >
                        <FAQContentText>{item.CONTENT}</FAQContentText>
                      </FAQContent>
                    )}
                  </FAQItem>
                ))}
              </FAQList>
            </ScrollableContent>
          )}

          {activeTab === "notice" && (
            <ScrollableContent showsVerticalScrollIndicator={false}>
              <NoticeList>
                {paginatedNotice.map((item: any, index) => (
                  <NoticeItem
                    key={item.NOTICE_BOARD_CONTENT_IDENTIFICATION_CODE}
                    onPress={() =>
                      navigation.navigate("NoticeDetail", { notice: item })
                    }
                    activeOpacity={1}
                    style={{
                      borderBottomWidth:
                        index === paginatedNotice.length - 1 ? 0 : 1,
                    }}
                  >
                    <NoticeItemLeft>
                      <NoticeCategory>[공지]</NoticeCategory>
                      <NoticeTitle>{item.TITLE}</NoticeTitle>
                    </NoticeItemLeft>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={theme.colors.gray400}
                    />
                  </NoticeItem>
                ))}
              </NoticeList>
            </ScrollableContent>
          )}
        </Content>
        {activeTab === "faq" && faqTotalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              disabled={faqCurrentPage === 1}
              onPress={() => handleFaqPageChange(faqCurrentPage - 1)}
              activeOpacity={1}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.text}
              />
            </PaginationButton>
            {Array.from({ length: faqTotalPages }, (_, i) => i + 1).map(
              (page) => (
                <PageNumber
                  key={page}
                  active={faqCurrentPage === page}
                  onPress={() => handleFaqPageChange(page)}
                  activeOpacity={1}
                >
                  <PageNumberText>{page}</PageNumberText>
                </PageNumber>
              )
            )}
            <PaginationButton
              disabled={faqCurrentPage === faqTotalPages}
              onPress={() => handleFaqPageChange(faqCurrentPage + 1)}
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

        {activeTab === "notice" && noticeTotalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              disabled={noticeCurrentPage === 1}
              onPress={() => handleNoticePageChange(noticeCurrentPage - 1)}
              activeOpacity={1}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.text}
              />
            </PaginationButton>
            {Array.from({ length: noticeTotalPages }, (_, i) => i + 1).map(
              (page) => (
                <PageNumber
                  key={page}
                  active={noticeCurrentPage === page}
                  onPress={() => handleNoticePageChange(page)}
                  activeOpacity={1}
                >
                  <PageNumberText>{page}</PageNumberText>
                </PageNumber>
              )
            )}
            <PaginationButton
              disabled={noticeCurrentPage === noticeTotalPages}
              onPress={() => handleNoticePageChange(noticeCurrentPage + 1)}
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

export default SupportScreen;
