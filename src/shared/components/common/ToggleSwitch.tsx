import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import styled, { useTheme } from "styled-components/native";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: "small" | "medium" | "large";
}

const sizes = {
  small: {
    width: 48,
    height: 28,
    thumbSize: 24,
    translateX: 20,
  },
  medium: {
    width: 51,
    height: 31,
    thumbSize: 27,
    translateX: 20,
  },
  large: {
    width: 54,
    height: 34,
    thumbSize: 30,
    translateX: 22,
  },
};

const ToggleSwitchTouchable = styled.TouchableOpacity<{
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const ToggleSwitchContainer = styled.View<{
  enabled: boolean;
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border-radius: 999px;
  background-color: ${({ enabled, theme }) =>
    enabled ? theme.colors.primary : theme.colors.gray500};
  padding: 2px;
  position: relative;
`;

const ToggleSwitchThumb = styled(Animated.View)<{ thumbSize: number }>`
  width: ${({ thumbSize }) => thumbSize}px;
  height: ${({ thumbSize }) => thumbSize}px;
  border-radius: ${({ thumbSize }) => thumbSize / 2}px;
  background-color: ${({ theme }) => theme.colors.gray0};
  position: absolute;
  top: 2px;
  left: 2px;
`;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  size = "small",
}) => {
  const theme = useTheme();
  const sizeConfig = sizes[size];
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sizeConfig.translateX],
  });

  return (
    <ToggleSwitchTouchable
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      width={sizeConfig.width}
      height={sizeConfig.height}
    >
      <ToggleSwitchContainer
        enabled={value}
        width={sizeConfig.width}
        height={sizeConfig.height}
      >
        <ToggleSwitchThumb
          thumbSize={sizeConfig.thumbSize}
          style={{
            transform: [{ translateX }],
          }}
        />
      </ToggleSwitchContainer>
    </ToggleSwitchTouchable>
  );
};

export default ToggleSwitch;
