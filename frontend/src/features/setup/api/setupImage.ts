import { apiClient } from "@/api/apiClient";
import { SetupImageInput, SetupResponse } from "../types";

/**
 * プロフィール画像をアップロードする関数
 */

export const setupImage = (data: SetupImageInput): Promise<SetupResponse> => {
    const formData = new FormData();
    formData.append("face_image", data.image);

    // ここをpatchにするかpostにするか問題
    return apiClient.patch("/users/setup/image", formData);
};