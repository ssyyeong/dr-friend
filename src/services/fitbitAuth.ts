import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { FitbitTokens } from "../@types/fitbit";
import { FITBIT_CONFIG } from "../shared/utils/fitbitConfig";

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEYS = {
  ACCESS_TOKEN: "fitbit_access_token",
  REFRESH_TOKEN: "fitbit_refresh_token",
  TOKEN_EXPIRY: "fitbit_token_expiry",
} as const;

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: FITBIT_CONFIG.AUTH_URL,
  tokenEndpoint: FITBIT_CONFIG.TOKEN_URL,
};

// 로그인
export const loginWithFitbit = async (): Promise<FitbitTokens> => {
  const request = new AuthSession.AuthRequest({
    clientId: FITBIT_CONFIG.CLIENT_ID,
    scopes: [...FITBIT_CONFIG.SCOPES],
    redirectUri: FITBIT_CONFIG.REDIRECT_URI,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== "success") {
    throw new Error("로그인이 취소되었거나 실패했습니다.");
  }

  const tokens = await exchangeCodeForToken(
    result.params.code,
    request.codeVerifier as string,
  );

  await saveTokens(tokens);
  return tokens;
};

// code → access_token 교환
const exchangeCodeForToken = async (
  code: string,
  codeVerifier: string,
): Promise<FitbitTokens> => {
  const credentials = btoa(
    `${FITBIT_CONFIG.CLIENT_ID}:${FITBIT_CONFIG.CLIENT_SECRET}`,
  );

  const response = await fetch(FITBIT_CONFIG.TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: FITBIT_CONFIG.REDIRECT_URI,
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`토큰 교환 실패: ${response.status}`);
  }

  return response.json() as Promise<FitbitTokens>;
};

// 토큰 저장
export const saveTokens = async (tokens: FitbitTokens): Promise<void> => {
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token),
    SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token),
    SecureStore.setItemAsync(
      STORAGE_KEYS.TOKEN_EXPIRY,
      String(Date.now() + tokens.expires_in * 1000),
    ),
  ]);
};

// Access Token 가져오기 (만료 시 자동 갱신)
export const getAccessToken = async (): Promise<string> => {
  const [accessToken, expiry] = await Promise.all([
    SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
  ]);
  console.log("accessToken", accessToken, expiry);
  if (!accessToken || !expiry) {
    throw new Error("로그인이 필요합니다.");
  }

  // 만료 5분 전 미리 갱신
  const isExpired = Date.now() > Number(expiry) - 5 * 60 * 1000;
  if (isExpired) {
    return refreshAccessToken();
  }

  return accessToken;
};

// 토큰 갱신
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await SecureStore.getItemAsync(
    STORAGE_KEYS.REFRESH_TOKEN,
  );

  if (!refreshToken) {
    throw new Error("다시 로그인해주세요.");
  }

  const credentials = btoa(
    `${FITBIT_CONFIG.CLIENT_ID}:${FITBIT_CONFIG.CLIENT_SECRET}`,
  );

  const response = await fetch(FITBIT_CONFIG.TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error("토큰 갱신 실패. 다시 로그인해주세요.");
  }

  const tokens = (await response.json()) as FitbitTokens;
  await saveTokens(tokens);
  return tokens.access_token;
};

// 로그아웃
export const logout = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
    SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
  ]);
};

// 로그인 여부 확인
export const isLoggedIn = async (): Promise<boolean> => {
  const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  return !!token;
};
