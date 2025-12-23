package repository

import "context"

type SessionRepositoryInterface interface {
	// セッションを作成し、セッションIDを返す
	CreateSession(ctx context.Context, userID string) (string, error)
	// セッションIDからUserIDを取得する (認証チェック用)
	GetUserID(ctx context.Context, sessionID string) (string, error)
	// セッションを削除する (ログアウト用)
	DeleteSession(ctx context.Context, sessionID string) error
}