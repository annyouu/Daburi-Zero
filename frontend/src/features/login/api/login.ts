import { apiClient } from "@/api/apiClient";
import { UserLoginInput, AuthTokenResponse } from "../types";

export const loginApi = async (data: UserLoginInput): Promise<AuthTokenResponse> => {
    return apiClient.post("auth/login", data);
};