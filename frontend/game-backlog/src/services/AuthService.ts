import { apiClient } from "./ApiClient";
import { isTokenValid } from "../helpers/isTokenValid";

export interface LoginInformation {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export class AuthService {
  static async login(credentials: LoginInformation): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>("/auth/login", credentials);

    localStorage.setItem("accessToken", data.token);

    return data;
  }

  static isAuthenticated(): boolean {
    return isTokenValid();
  }

  static logout(): void {
    localStorage.removeItem("accessToken");
  }

  static getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();