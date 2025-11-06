export interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export interface SessionTokenResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface ApiRegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface ApiRegisterResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface ApiLoginRequest {
  email: string;
  password: string;
}

export interface ApiLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}
