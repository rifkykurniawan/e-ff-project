import apiClient from "./apiClient";
import type { LoginCredentials, TokenResponse, UserResponse, EnvelopeResponse } from "../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<EnvelopeResponse<TokenResponse>> => {
    const response = await apiClient.post<EnvelopeResponse<TokenResponse>>("/auth/login", credentials);
    return response.data;
  },
  
  getMe: async (): Promise<EnvelopeResponse<UserResponse>> => {
    const response = await apiClient.get<EnvelopeResponse<UserResponse>>("/auth/me");
    return response.data;
  }
};
