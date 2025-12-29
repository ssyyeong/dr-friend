// 토큰 및 사용자 식별 코드 저장 및 관리 서비스

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@dr_friend:auth_token";
const MEMBER_ID_KEY = "@dr_friend:member_id";

/**
 * 로그인 토큰을 저장합니다.
 * @param token - 저장할 인증 토큰
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("토큰 저장 실패:", error);
    throw error;
  }
};

/**
 * 저장된 로그인 토큰을 가져옵니다.
 * @returns 토큰이 있으면 토큰 문자열, 없으면 null
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * 저장된 로그인 토큰을 삭제합니다.
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("토큰 삭제 실패:", error);
    throw error;
  }
};

/**
 * APP_MEMBER_IDENTIFICATION_CODE를 저장합니다.
 * @param memberId - 저장할 사용자 식별 코드
 */
export const saveMemberId = async (memberId: number): Promise<void> => {
  try {
    console.log("saveMemberId", memberId);
    await AsyncStorage.setItem(MEMBER_ID_KEY, memberId.toString());
  } catch (error) {
    console.error("사용자 식별 코드 저장 실패:", error);
    throw error;
  }
};

/**
 * 저장된 APP_MEMBER_IDENTIFICATION_CODE를 가져옵니다.
 * @returns 식별 코드가 있으면 문자열, 없으면 null
 */
export const getMemberId = async (): Promise<string | null> => {
  try {
    const memberId = await AsyncStorage.getItem(MEMBER_ID_KEY);
    return memberId;
  } catch (error) {
    console.error("사용자 식별 코드 가져오기 실패:", error);
    return null;
  }
};

/**
 * 저장된 APP_MEMBER_IDENTIFICATION_CODE를 삭제합니다.
 */
export const removeMemberId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MEMBER_ID_KEY);
  } catch (error) {
    console.error("사용자 식별 코드 삭제 실패:", error);
    throw error;
  }
};

/**
 * 로그인 상태를 확인합니다.
 * @returns 토큰이 있으면 true, 없으면 false
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null && token.length > 0;
};

/**
 * 모든 인증 정보를 삭제합니다 (로그아웃 시 사용).
 */
export const clearAuth = async (): Promise<void> => {
  try {
    await Promise.all([removeToken(), removeMemberId()]);
  } catch (error) {
    console.error("인증 정보 삭제 실패:", error);
    throw error;
  }
};
