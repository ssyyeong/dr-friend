import React from "react";
import styled from "styled-components/native";

interface FilterTabsProps {
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  size?: "small" | "medium";
}

const FilterContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const FilterButton = styled.TouchableOpacity<{
  active: boolean;
  size: "small" | "medium";
}>`
  padding: ${({ size }) => (size === "small" ? "8px 16px" : "6px 16px")};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray700};
`;

const FilterButtonText = styled.Text<{
  active: boolean;
  size: "small" | "medium";
}>`
  font-size: ${({ size }) => (size === "small" ? "14px" : "16px")};
  font-weight: 500;
  color: ${({ active, theme }) =>
    active ? theme.colors.text : theme.colors.textSecondary};
`;

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  size = "small",
}) => {
  return (
    <FilterContainer>
      {tabs.map((tab) => (
        <FilterButton
          key={tab}
          active={selectedTab === tab}
          size={size}
          onPress={() => onTabChange(tab)}
          activeOpacity={0.7}
        >
          <FilterButtonText active={selectedTab === tab} size={size}>
            {tab}
          </FilterButtonText>
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default FilterTabs;
