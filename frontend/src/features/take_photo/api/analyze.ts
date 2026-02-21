import { apiClient } from "@/api/apiClient";
import type { AnalyzeResponse } from "../types";

/**
 * 画像をバックエンドへ送信し、解析結果を取得する
 */
export const analyzePhoto = (file: File): Promise<AnalyzeResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient.post("/users/analyze", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
