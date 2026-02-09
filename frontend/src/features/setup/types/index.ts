export interface SetupNameInput {
  name: string;
}

export interface SetupResponse {
    id: string;
    name: string;
    email: string;
    status: string;
}

export interface SetupImageInput {
    image: File;
}