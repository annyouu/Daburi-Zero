// 認証に関するapiのみを叩く役割
import { apiClient } from "@/lib/apiClient";
import { UserResponse, AuthTokenOutput } from "@/type/user";

export const authEndpoints = {
    /**
     * 新規登録
     * @param data { email, password }
     * @returns UserResponse (status: PENDING_NAME などが返る)
     */

    register: (data: any): Promise<UserResponse> => {
        return apiClient.post<UserResponse>("/auth/register", data);
    },

    /**
     * ログイン
     * @param data { email, password }
     * @returns AuthTokenOutput (token と status が返る)
     */

    login: (data: any): Promise<AuthTokenOutput> => {
        return apiClient.post<AuthTokenOutput>("/auth/login", data);
    },
};