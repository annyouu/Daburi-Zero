package dto

import "time"

// -- 入力データ --

// 1: 新規登録（PENDING_NAMEへ）
type UserRegisterInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// 2: 名前設定（PENDING_IMAGEへ）
type UserSetupNameInput struct {
	Name string `json:"name" validate:"required"`
}

// 3: 画像設定（ACTIVEへ）
type UserSetupImageInput struct {
	ProfileImageURL string `json:"profile_image_url" validate:"required"`
}

// ログイン用
type UserLoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// プロフィール更新用、更新したい項目のみ受け取る
type UserUpdateInput struct {
	Name string  `json:"name"`
	ProfileImageURL string `json:"profile_image_url"`
}

// -- 出力データ --

// ユーザー情報を返す用
type UserOutput struct {
	ID string  `json:"id"`
	Name string  `json:"name"`
	Email string  `json:"email"`
	ProfileImageURL string `json:"profile_image_url"`
	Status string    `json:"status"`
	Token string    `json:"token,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// ログイン成功時にトークンを返す用
type AuthTokenOutput struct {
	Token string `json:"token"`
}