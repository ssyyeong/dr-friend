import React, { useState } from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../shared/components/common/Header";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../app/navigation/RootNavigator";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [faqCurrentPage, setFaqCurrentPage] = useState(1);
  const [noticeCurrentPage, setNoticeCurrentPage] = useState(1);

  // 샘플 FAQ 데이터
  const faqData: FAQItem[] = [
    {
      id: 1,
      category: "서비스",
      title: "질문의 제목이 노출됩니다.",
      content:
        "작성한 답변이 들어갑니다. 작성한 답변이 들어갑니다. 작성한 답변이 들어갑니다. 작성한 답변이 들어갑니다. 작성한 답변이 들어갑니다. 작성한 답변이 들어갑니다.",
    },
    {
      id: 2,
      category: "데이터",
      title: "질문의 제목이 노출됩니다.",
      content: "답변 내용이 여기에 표시됩니다.",
    },
    {
      id: 3,
      category: "데이터",
      title: "질문의 제목이 노출됩니다.",
      content: "답변 내용이 여기에 표시됩니다.",
    },
    {
      id: 4,
      category: "서비스",
      title: "질문의 제목이 노출됩니다.",
      content: "답변 내용이 여기에 표시됩니다.",
    },
    {
      id: 5,
      category: "데이터",
      title: "질문의 제목이 노출됩니다.",
      content: "답변 내용이 여기에 표시됩니다.",
    },
    {
      id: 6,
      category: "데이터",
      title: "질문의 제목이 노출됩니다.",
      content: "답변 내용이 여기에 표시됩니다.",
    },
  ];

  // 샘플 공지사항 데이터
  const noticeData: NoticeItem[] = [
    {
      id: 1,
      category: "공지",
      title: "공지사항 제목이 노출됩니다.",
      content:
        "공지 사항 내용이 여기에 표시됩니다. 공지 사항 내용이 여기에 표시됩니다.",
      date: "2024.01.15",
    },
    {
      id: 2,
      category: "서비스",
      title: "공지사항 제목이 노출됩니다.",
      content: "공지 사항 내용이 여기에 표시됩니다.",
      date: "2024.01.10",
    },
    {
      id: 3,
      category: "데이터",
      title: "공지사항 제목이 노출됩니다.",
      content: "공지 사항 내용이 여기에 표시됩니다.",
      date: "2024.01.05",
    },
    {
      id: 4,
      category: "공지",
      title: "공지사항 제목이 노출됩니다.",
      content: "공지 사항 내용이 여기에 표시됩니다.",
      date: "2024.01.01",
    },
    {
      id: 5,
      category: "서비스",
      title: "공지사항 제목이 노출됩니다.",
      content: "공지 사항 내용이 여기에 표시됩니다.",
      date: "2023.12.25",
    },
    {
      id: 6,
      category: "데이터",
      title: "공지사항 제목이 노출됩니다.",
      content: "공지 사항 내용이 여기에 표시됩니다.",
      date: "2023.12.20",
    },
  ];

  const categories = ["전체", "서비스", "데이터", "기타"];

  const toggleFAQ = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ =
    selectedCategory === "전체"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  const itemsPerPage = 5;
  const faqTotalPages = Math.ceil(filteredFAQ.length / itemsPerPage);
  const faqStartIndex = (faqCurrentPage - 1) * itemsPerPage;
  const faqEndIndex = faqStartIndex + itemsPerPage;
  const paginatedFAQ = filteredFAQ.slice(faqStartIndex, faqEndIndex);

  const noticeTotalPages = Math.ceil(noticeData.length / itemsPerPage);
  const noticeStartIndex = (noticeCurrentPage - 1) * itemsPerPage;
  const noticeEndIndex = noticeStartIndex + itemsPerPage;
  const paginatedNotice = noticeData.slice(noticeStartIndex, noticeEndIndex);

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
                {categories.map((category) => (
                  <CategoryChip
                    key={category}
                    selected={selectedCategory === category}
                    onPress={() => {
                      setSelectedCategory(category);
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
                {paginatedFAQ.map((item) => (
                  <FAQItem key={item.id}>
                    <FAQHeader
                      expanded={expandedItems.has(item.id)}
                      onPress={() => toggleFAQ(item.id)}
                      activeOpacity={1}
                    >
                      <FAQCategory>[{item.category}]</FAQCategory>
                      <FAQTitle>{item.title}</FAQTitle>
                      <Ionicons
                        name={
                          expandedItems.has(item.id)
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={24}
                        color={theme.colors.text}
                      />
                    </FAQHeader>
                    {expandedItems.has(item.id) && (
                      <FAQContent expanded={expandedItems.has(item.id)}>
                        <FAQContentText>{item.content}</FAQContentText>
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
                {paginatedNotice.map((item, index) => (
                  <NoticeItem
                    key={item.id}
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
                      <NoticeCategory>[{item.category}]</NoticeCategory>
                      <NoticeTitle>{item.title}</NoticeTitle>
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
