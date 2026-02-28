import { apiClient } from "@/api/apiClient";
import type { RegisterItemRequest, RegisterItemResponse } from "../types";

export const registerItem = (data: RegisterItemRequest): Promise<RegisterItemResponse> => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("name", data.name);
  formData.append("category", data.category);

  return apiClient.post("/items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
