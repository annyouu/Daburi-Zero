import { apiClient } from "@/api/apiClient";
import { SetupNameInput, SetupResponse } from "../types";

/**
 * ユーザー名を設定し、更新されたユーザー情報を取得する
 */

export const setupName = (name: SetupNameInput): Promise<SetupResponse> => {
    return apiClient.patch("/users/setup/name", name);
};


