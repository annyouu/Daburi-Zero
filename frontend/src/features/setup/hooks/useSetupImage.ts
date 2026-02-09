import { useState } from "react";
import { setupImage } from "../api/setupImage";
import type { SetupResponse } from "../types";

export const useSetupImage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetupImage = async (file: File): Promise<SetupResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await setupImage({ image: file });
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || "画像のアップロードに失敗しました。";
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleSetupImage,
    }
};