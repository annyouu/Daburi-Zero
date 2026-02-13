/**
 * ユーザーの進行ステータス
 */
export type UserStatus = 'PENDING_NAME' | 'PENDING_IMAGE' | 'ACTIVE';

/**
 * ログイン 入力 (UserLoginInput)
 */
export interface UserLoginInput {
  email: string;
  password: string;
}

/**
 * ログイン成功時 出力 (AuthTokenOutput)
 */
export interface AuthTokenResponse {
  token: string;
  status: UserStatus;
}