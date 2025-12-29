import React from "react";
import styled from "styled-components/native";
import { FlatList, TouchableOpacity } from "react-native";
import CareCard from "./CareCard";
import FilterTabs from "../../../shared/components/common/FilterTabs";

interface CareItem {
  id: string;
  image: any | null;
  title: string;
}

interface CareSectionProps {
  title: string;
  description: string;
  items: CareItem[];
  onMorePress: () => void;
  onItemPress?: (item: CareItem) => void;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const SectionContainer = styled.View`
  margin-bottom: 40px;
  margin-top: 24px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const MoreButton = styled(TouchableOpacity)`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.gray700};
`;

const MoreButtonText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const CategoryTabsContainer = styled.View`
  margin-bottom: 24px;
`;

const CareSection: React.FC<CareSectionProps> = ({
  title,
  description,
  items,
  onMorePress,
  onItemPress,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <MoreButton onPress={onMorePress} activeOpacity={0.7}>
          <MoreButtonText>더보기</MoreButtonText>
        </MoreButton>
      </SectionHeader>
      <SectionDescription>{description}</SectionDescription>
      {categories && categories.length > 0 && (
        <CategoryTabsContainer>
          <FilterTabs
            tabs={categories}
            selectedTab={selectedCategory || ""}
            onTabChange={(tab: string) => onCategoryChange?.(tab)}
            size="medium"
          />
        </CategoryTabsContainer>
      )}
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CareCard
            image={item.image}
            title={item.title}
            onPress={() => onItemPress?.(item)}
          />
        )}
        contentContainerStyle={{ paddingRight: 24 }}
      />
    </SectionContainer>
  );
};

export default CareSection;
