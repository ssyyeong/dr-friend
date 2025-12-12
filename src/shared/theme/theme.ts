// src/theme/theme.ts
import { DefaultTheme } from "styled-components/native";

export const theme: DefaultTheme = {
  colors: {
    // Brand
    primary: "#7353FF",
    secondary: "#25C3FB",

    // Alert
    warning: "#DB4860",

    // Grayscale
    gray0: "#F2F5FA",
    gray50: "#E0E9F4",
    gray100: "#CAD7E7",
    gray200: "#AFBFD4",
    gray300: "#889CB6",
    gray400: "#6E86A5",
    gray500: "#4F6B91",
    gray600: "#324C71",
    gray700: "#273C5A",
    gray800: "#182E4B",
    gray900: "#0C1D33",
    gray1000: "#09182C",

    // Background / Text Defaults
    background: "#0C1D33", // 다크한 전체 배경
    surface: "#09182C", // 카드, 모달 배경
    tabBar: "#0C1D33", // 탭바 배경 (추가)
    text: "#F2F5FA", // 기본 White
    textSecondary: "#4F6B91", // 보조 텍스트
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },
};

// 예전처럼 colors만 쓰고 싶은 경우를 위해서 이거도 같이 export 해둬도 됨
export const colors = theme.colors;
