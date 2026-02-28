import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getProfile, updateProfileName, updateProfileImage, changePassword } from "../api/profile";
import type { UserResponse } from "@/features/auth/types";
import type { ChangePasswordInput } from "../types";

export const useProfile = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch {
        setError("プロフィールの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateName = async (name: string): Promise<boolean> => {
    try {
      const data = await updateProfileName({ name });
      // 更新レスポンスに password が含まれないため、既存の値を維持してマージ
      setUser((prev) => (prev ? { ...prev, ...data, password: prev.password } : data));
      return true;
    } catch {
      setError("名前の更新に失敗しました");
      return false;
    }
  };

  const updateImage = async (file: File): Promise<boolean> => {
    try {
      const data = await updateProfileImage(file);
      // 更新レスポンスに password が含まれないため、既存の値を維持してマージ
      setUser((prev) => (prev ? { ...prev, ...data, password: prev.password } : data));
      return true;
    } catch {
      setError("画像の更新に失敗しました");
      return false;
    }
  };

  const updatePassword = async (data: ChangePasswordInput): Promise<boolean> => {
    try {
      await changePassword(data);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || "パスワードの変更に失敗しました";
      setError(message);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return { user, isLoading, error, updateName, updateImage, updatePassword, logout };
};
