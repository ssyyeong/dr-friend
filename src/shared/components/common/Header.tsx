import React from "react";
import { useNavigation } from "@react-navigation/native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderLeft = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: flex-start;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  text-align: center;
`;

const HeaderRightContainer = styled.View`
  justify-content: center;
`;

const HeaderRightButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: flex-end;
`;

const RightButtonText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightButton?:
    | {
        text: string;
        onPress: () => void;
      }
    | React.ReactNode;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightButton,
  onBackPress,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const renderRightButton = () => {
    if (!rightButton) return <HeaderRightContainer />;

    if (typeof rightButton === "object" && "text" in rightButton) {
      return (
        <HeaderRightButton onPress={rightButton.onPress}>
          <RightButtonText>{rightButton.text}</RightButtonText>
        </HeaderRightButton>
      );
    }

    return <HeaderRightContainer>{rightButton}</HeaderRightContainer>;
  };

  // SafeAreaView 안에 있을 때를 대비해 최소값 보장
  // insets.top이 0이거나 작을 경우를 대비해 최소 48px 보장
  const topPadding = Math.max(insets.top + 16, 48);

  return (
    <HeaderContainer style={{ paddingTop: topPadding }}>
      {showBackButton ? (
        <HeaderLeft onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </HeaderLeft>
      ) : (
        <HeaderRightContainer />
      )}
      <HeaderTitle>{title}</HeaderTitle>
      {renderRightButton()}
    </HeaderContainer>
  );
};

export default Header;
