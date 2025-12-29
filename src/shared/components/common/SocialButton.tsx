import React from "react";
import styled from "styled-components/native";
import { TouchableOpacityProps, ImageSourcePropType } from "react-native";
import { SvgProps } from "react-native-svg";

interface SocialButtonProps extends TouchableOpacityProps {
  icon: ImageSourcePropType | React.FC<SvgProps>;
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

const IconContainer = styled.View`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
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
  // SVG 컴포넌트인지 확인 (함수인 경우)
  const isSvgComponent = typeof icon === "function";

  return (
    <SocialButtonContainer activeOpacity={1} {...props}>
      {isSvgComponent ? (
        <IconContainer>
          {React.createElement(icon as React.FC<SvgProps>, {
            width: 24,
            height: 24,
          })}
        </IconContainer>
      ) : (
        <IconImage source={icon as ImageSourcePropType} resizeMode="contain" />
      )}
      <Label>{label}</Label>
    </SocialButtonContainer>
  );
};

export default SocialButton;
