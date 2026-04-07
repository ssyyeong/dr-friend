export const FITBIT_CONFIG = {
  CLIENT_ID: process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID as string,
  CLIENT_SECRET: process.env.EXPO_PUBLIC_FITBIT_CLIENT_SECRET as string,
  REDIRECT_URI: "drfriend://callback",
  SCOPES: ["sleep", "heartrate", "profile"],
  AUTH_URL: "https://www.fitbit.com/oauth2/authorize",
  TOKEN_URL: "https://api.fitbit.com/oauth2/token",
} as const;
