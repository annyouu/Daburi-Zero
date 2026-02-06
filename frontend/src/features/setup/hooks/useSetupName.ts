import { useState } from "react";
import { setupName } from "../api/setupName";
import type { SetupNameInput, SetupResponse } from "../types";

export const useSetupName = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetupName = async (name: SetupNameInput): Promise<SetupResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await setupName(name);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || "名前の保存に失敗しました。";
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleSetupName,
    };
};