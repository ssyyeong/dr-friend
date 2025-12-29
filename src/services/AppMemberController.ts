import axios from "axios";
import serverSettings from "./serviceSettings";

// 옵션과 모델 설정에 사용할 기본 인터페이스 (필요에 따라 확장 가능)
export interface IControllerOptions {
  [key: string]: any;
}

export interface IModelConfig extends Record<string, any> {}

class AppMemberController {
  modelName?: string;
  modelId?: string;
  apiUrl: string;
  rootRoute: string;
  role: string;
  mergedPath: string;
  modelConfig: IModelConfig | null;

  constructor({
    modelName,
    modelId,
  }: {
    modelName?: string;
    modelId?: string;
  }) {
    this.modelName = modelName;
    this.modelId = modelId;
    this.apiUrl = serverSettings.config.apiUrl;
    this.rootRoute = "/api";
    this.role = "user";
    // 예: https://localhost:4021/api/user/{modelId}
    this.mergedPath = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}`;
    this.modelConfig = null;
  }

  async signUp(option: IControllerOptions): Promise<any> {
    const params = option;
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/sign_up/local`;
    const response = await axios.post(url, params);

    return response;
  }

  async signIn(option: IControllerOptions): Promise<any> {
    const params = option;
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/sign_in/local`;
    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 또는 특정 도메인
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

    return response;
  }

  async getProfile(option: IControllerOptions): Promise<any> {
    const params = option;
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/profile`;
    const response = await axios.get(url, params);

    return response;
  }

  async googleLogin(option: IControllerOptions): Promise<any> {
    const params = option;
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/google_login`;
    const response = await axios.post(url, params);

    return response;
  }

  // 서버 연결 테스트
  async testConnection(): Promise<boolean> {
    try {
      const testUrl = `${this.apiUrl}/health`; // 또는 서버의 health check 엔드포인트
      console.log("서버 연결 테스트:", testUrl);
      const response = await axios.get(testUrl, { timeout: 5000 });
      console.log("서버 연결 성공:", response.status);
      return true;
    } catch (error: any) {
      console.warn("서버 연결 테스트 실패:", error.message);
      return false;
    }
  }

  async sendPhoneNumberVerificationCode(
    option: IControllerOptions
  ): Promise<any> {
    console.log("sendPhoneNumberVerificationCode", option);
    const params = option;
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/send_phone_auth`;

    console.log("=== API 요청 정보 ===");
    console.log("URL:", url);
    console.log("Params:", JSON.stringify(params, null, 2));
    console.log("API Base URL:", this.apiUrl);

    try {
      const response = await axios.post(url, params);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async verifyPhoneVerificationCode(option: IControllerOptions): Promise<any> {
    const params = option;
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/validate_phone_auth`;
    const response = await axios.post(url, params);

    return response;
  }
}
export default AppMemberController;
