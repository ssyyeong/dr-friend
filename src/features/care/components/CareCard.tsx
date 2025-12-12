import React from "react";
import styled from "styled-components/native";
import { Image, ImageSourcePropType, View } from "react-native";

interface CareCardProps {
  image: ImageSourcePropType | null;
  title: string;
  onPress?: () => void;
}

const CardContainer = styled.TouchableOpacity`
  width: 160px;
  margin-right: 16px;
`;

const CardImageContainer = styled.View`
  width: 168px;
  height: 120px;
  overflow: hidden;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 8px;
`;

const CareCard: React.FC<CareCardProps> = ({ image, title, onPress }) => {
  return (
    <CardContainer onPress={onPress} activeOpacity={0.8}>
      <CardImageContainer>
        {image ? (
          <CardImage source={image} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </CardImageContainer>
      <CardTitle>{title}</CardTitle>
    </CardContainer>
  );
};

export default CareCard;
