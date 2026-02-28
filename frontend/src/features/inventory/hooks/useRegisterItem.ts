import { useState } from "react";
import { analyzePhoto } from "@/features/take_photo/api/analyze";
import { registerItem } from "../api/registerItem";
import type { RegisterItemRequest, RegisterItemResponse } from "../types";

export const useRegisterItem = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeForName = async (file: File): Promise<string | null> => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await analyzePhoto(file);
      return res.product_name || null;
    } catch {
      setError("商品名の解析に失敗しました。手入力してください。");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const register = async (data: RegisterItemRequest): Promise<RegisterItemResponse | null> => {
    setIsRegistering(true);
    setError(null);
    try {
      const res = await registerItem(data);
      return res;
    } catch {
      setError("在庫の登録に失敗しました。もう一度お試しください。");
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  return { analyzeForName, register, isAnalyzing, isRegistering, error };
};
