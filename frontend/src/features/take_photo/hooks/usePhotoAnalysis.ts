import { useState } from "react";
import { analyzePhoto } from "../api/analyze";
import type { AnalyzeResponse } from "../types";

export const usePhotoAnalysis = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyze = async (file: File) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await analyzePhoto(file);
            setResult(res);
        } catch (err) {
            console.error("解析失敗:", err);
            setError("画像の解析に失敗しました。もう一度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        analyze,
        isLoading,
        result,
        error,
    };
};
