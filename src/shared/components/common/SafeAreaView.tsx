import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Android 하단 네비게이션 바 등 safe area를 반영하는 래퍼.
 * useSafeAreaInsets()로 padding을 적용하므로 패키지의 SafeAreaView export에 의존하지 않음.
 */
export function SafeAreaView({ style, children, ...props }: ViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
