export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  registeredAt: string; // ISO 8601
}

export interface RegisterItemRequest {
  name: string;
  category: string;
  image: File;
}

export interface RegisterItemResponse {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  registeredAt: string;
}

