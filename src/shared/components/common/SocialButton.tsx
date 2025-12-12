import React from "react";
import styled from "styled-components/native";
import { TouchableOpacityProps, ImageSourcePropType } from "react-native";

interface SocialButtonProps extends TouchableOpacityProps {
  icon: ImageSourcePropType;
  label: string;
}

const SocialButtonContainer = styled.TouchableOpacity`
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray700};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-bottom: 12px;
`;

const IconImage = styled.Image`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 19px;
  font-weight: 500;
`;

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  ...props
}) => {
  return (
    <SocialButtonContainer activeOpacity={1} {...props}>
      <IconImage source={icon} resizeMode="contain" />
      <Label>{label}</Label>
    </SocialButtonContainer>
  );
};

export default SocialButton;
