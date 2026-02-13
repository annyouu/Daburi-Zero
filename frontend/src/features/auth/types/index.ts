/**
 * ユーザーの進行ステータス
 */
export type UserStatus = 'PENDING_NAME' | 'PENDING_IMAGE' | 'ACTIVE';

/**
 * 1: 新規登録 入力 (UserRegisterInput)
 */
export interface UserRegisterInput {
  email: string;
  password: string;
}

/**
 * 2: 名前設定 入力 (UserSetupNameInput)
 */
export interface UserSetupNameInput {
  name: string;
}

/**
 * 3: 画像設定 入力 (UserSetupImageInput)
 */
export interface UserSetupImageInput {
  profile_image_url: string;
}

/**
 * 汎用ユーザー出力 (UserOutput)
 * Register, GetProfile, UpdateProfile などのレスポンスに使用
 */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  profile_image_url: string;
  status: UserStatus;
  token?: string; // omitempty 対応
  created_at: string;
}