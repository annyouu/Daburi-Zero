import { apiClient } from "@/api/apiClient";
import type { UserResponse } from "@/features/auth/types";
import type { UpdateProfileNameInput, ChangePasswordInput } from "../types";

export const getProfile = (): Promise<UserResponse> => {
  return apiClient.get("/users/me");
};

export const updateProfileName = (data: UpdateProfileNameInput): Promise<UserResponse> => {
  return apiClient.patch("/users/me", data);
};

export const updateProfileImage = (file: File): Promise<UserResponse> => {
  const formData = new FormData();
  formData.append("profile_image", file);
  // Content-Type は axios に任せることで boundary が自動付与される
  return apiClient.patch("/users/me/image", formData);
};

export const changePassword = (data: ChangePasswordInput): Promise<void> => {
  return apiClient.patch("/users/me", data);
};
