// src/@types/styled.d.ts
import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      warning: string;

      gray0: string;
      gray50: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      gray1000: string;

      background: string;
      surface: string;
      tabBar: string;
      text: string;
      textSecondary: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    radius: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
      pill: number;
    };
  }
}
