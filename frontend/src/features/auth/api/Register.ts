import { apiClient } from "@/api/apiClient";
import type { UserRegisterInput, UserResponse } from "../types";

/**
 * 新規登録リクエストを送る関数
 * @param data { email, password }
 * @returns サーバーからのレスポンス（token, statusなど）
 */

export const registerUser = (data: UserRegisterInput): Promise<UserResponse> => {
    return apiClient.post("auth/register", data);
};