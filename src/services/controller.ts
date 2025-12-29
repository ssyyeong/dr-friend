// ControllerAbstractBase.ts
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

import serverSettings from "./serviceSettings";
import { getToken, getMemberId } from "./authService";

// 옵션과 모델 설정에 사용할 기본 인터페이스 (필요에 따라 확장 가능)
export interface IControllerOptions {
  [key: string]: any;
}

export interface IModelConfig extends Record<string, any> {}

class ControllerAbstractBase {
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
    this.mergedPath = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}`;
    this.modelConfig = null;
  }

  async parseResponse(response: AxiosResponse): Promise<any> {
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to load data");
  }

  // axios 요청에 토큰 헤더 추가
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  // 모델 설정을 불러옴
  async getModelConfig(): Promise<IModelConfig | null> {
    const url = `${this.apiUrl}${this.rootRoute}/common/model/find_one`;
    const params = { MODEL_NAME: this.modelName };
    const headers = await this.getAuthHeaders();
    const response = await axios.get(url, {
      params,
      headers,
    });
    const res = await this.parseResponse(response);
    return res.result ? res.result : null;
  }

  // findOne: 모델 설정(FIND_ONE)을 바탕으로 옵션 키 목록을 구성하여 GET 요청
  async findOne(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const findOption: IControllerOptions = {};
    if (this.modelConfig && this.modelConfig.FIND_ONE) {
      const keyList: Array<{ KEY: string }> =
        this.modelConfig.FIND_ONE.FIND_OPTION_KEY_LIST;
      keyList.forEach((config) => {
        if (option[config.KEY] !== undefined) {
          findOption[config.KEY] = option[config.KEY];
        }
      });
    }
    const params = { FIND_OPTION_KEY_LIST: JSON.stringify(findOption) };
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/find_one`;
    const headers = await this.getAuthHeaders();
    const response = await axios.get(url, { params, headers });
    return await this.parseResponse(response);
  }

  // findOneByKey: 옵션 객체를 그대로 JSON 문자열로 감싸서 GET 요청
  async findOneByKey(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const params = { FIND_OPTION_KEY_LIST: JSON.stringify(option) };
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/find_by_key`;
    const headers = await this.getAuthHeaders();
    const response = await axios.get(url, { params, headers });
    return await this.parseResponse(response);
  }

  // findAll: 모델 설정(FIND_ALL)을 바탕으로 옵션 키 목록을 구성하여 GET 요청
  async findAll(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const findOption: IControllerOptions = {};
    const keyList: Array<{ KEY: string }> =
      this.modelConfig?.FIND_ALL?.FIND_OPTION_KEY_LIST || [];
    keyList.forEach((config) => {
      if (option[config.KEY] !== undefined) {
        findOption[config.KEY] = option[config.KEY];
      }
    });
    const params = { FIND_OPTION_KEY_LIST: JSON.stringify(findOption) };
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/find_all`;
    const headers = await this.getAuthHeaders();
    const response = await axios.get(url, {
      params,
      headers,
    });
    return await this.parseResponse(response);
  }

  // findAllByJoinKey: join key를 이용하여 GET 요청
  async findAllByJoinKey(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const params = { FIND_OPTION_KEY_LIST: JSON.stringify(option) };
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/find_all_by_joined_key`;
    const headers = await this.getAuthHeaders();
    const response = await axios.get(url, { params, headers });
    return await this.parseResponse(response);
  }

  // create: 모델 생성을 위한 POST 요청
  async create(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const createOption: IControllerOptions = {};
    const keyList: Array<{ KEY: string }> =
      this.modelConfig?.CREATE?.CREATE_OPTION_KEY_LIST || [];
    keyList.forEach((config) => {
      if (option[config.KEY] !== undefined) {
        createOption[config.KEY] = option[config.KEY];
      }
    });

    // authService에서 사용자 식별 코드 가져오기
    try {
      const memberId = await getMemberId();
      if (memberId) {
        createOption.APP_MEMBER_IDENTIFICATION_CODE = memberId;
      }
    } catch (error) {
      console.error("사용자 식별 코드 가져오기 실패:", error);
    }

    const data = { CREATE_OPTION_KEY_LIST: JSON.stringify(createOption) };
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/create`;
    const headers = await this.getAuthHeaders();
    const response = await axios.post(url, data, { headers });
    return await this.parseResponse(response);
  }

  // update: 모델 업데이트를 위한 PUT 요청
  async update(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const findOption: IControllerOptions = {};
    const updateOption: IControllerOptions = {};
    const findKeyList: Array<{ KEY: string }> =
      this.modelConfig?.UPDATE?.FIND_OPTION_KEY_LIST || [];
    findKeyList.forEach((config) => {
      if (option[config.KEY] !== undefined) {
        findOption[config.KEY] = option[config.KEY];
      }
    });
    const updateKeyList: Array<{ KEY: string }> =
      this.modelConfig?.UPDATE?.UPDATE_OPTION_KEY_LIST || [];
    updateKeyList.forEach((config) => {
      if (option[config.KEY] !== undefined) {
        updateOption[config.KEY] = option[config.KEY];
      }
    });

    const data = {
      FIND_OPTION_KEY_LIST: JSON.stringify(findOption),
      UPDATE_OPTION_KEY_LIST: JSON.stringify(updateOption),
    };
    console.log(data);
    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/update`;
    const headers = await this.getAuthHeaders();
    const response = await axios.put(url, data, { headers });
    return await this.parseResponse(response);
  }

  // delete: 모델 삭제(또는 비활성화) 처리를 위한 PUT 요청
  async delete(option: IControllerOptions): Promise<any> {
    if (!this.modelConfig) {
      this.modelConfig = await this.getModelConfig();
    }
    const findOption: IControllerOptions = {};
    const deleteOption: IControllerOptions = {};
    const findKeyList: Array<{ KEY: string }> =
      this.modelConfig?.DELETE?.FIND_OPTION_KEY_LIST || [];
    findKeyList.forEach((config) => {
      if (option[config.KEY] !== undefined) {
        findOption[config.KEY] = option[config.KEY];
      }
    });
    const updateKeyList: Array<{ KEY: string }> =
      this.modelConfig?.DELETE?.UPDATE_OPTION_KEY_LIST || [];
    updateKeyList.forEach((config) => {
      if (option[config.KEY] !== undefined) {
        deleteOption[config.KEY] = option[config.KEY];
      }
    });

    const data = {
      FIND_OPTION_KEY_LIST: JSON.stringify(findOption),
      UPDATE_OPTION_KEY_LIST: JSON.stringify(deleteOption),
    };

    const url = `${this.apiUrl}${this.rootRoute}/${this.role}/${this.modelId}/delete`;
    const headers = await this.getAuthHeaders();
    const response = await axios.put(url, data, { headers });
    return await this.parseResponse(response);
  }
}

export default ControllerAbstractBase;
