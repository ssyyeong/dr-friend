import React from "react";
import styled from "styled-components/native";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ButtonVariant = "primary" | "ghost" | "gradient" | "block";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const PrimaryButton = styled.TouchableOpacity`
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const GhostButton = styled(PrimaryButton)`
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const BlockButton = styled(PrimaryButton)`
  background-color: ${({ theme }) => theme.colors.gray500};
`;

const GradientButtonContainer = styled.View`
  height: 56px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
`;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.gray0};
  font-size: 19px;
  font-weight: 500;
`;

const BlockLabel = styled(Label)`
  color: ${({ theme }) => theme.colors.text};
`;

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  if (variant === "ghost") {
    return (
      <GhostButton {...props}>
        <Label>{children}</Label>
      </GhostButton>
    );
  }

  if (variant === "gradient") {
    return (
      <TouchableOpacity activeOpacity={1} {...props}>
        <GradientButtonContainer>
          <GradientBackground
            colors={["#7353FF", "#25C3FB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Label>{children}</Label>
          </GradientBackground>
        </GradientButtonContainer>
      </TouchableOpacity>
    );
  }

  if (variant === "block") {
    return (
      <BlockButton {...props}>
        <BlockLabel>{children}</BlockLabel>
      </BlockButton>
    );
  }

  return (
    <PrimaryButton activeOpacity={1} {...props}>
      <Label>{children}</Label>
    </PrimaryButton>
  );
};

export default Button;
