package repository

import (
	"context"
	"io"
)

type FileStorageInterface interface {
	// データをアップロードして、アクセス用のフルURLを返
	Upload(ctx context.Context, file io.Reader, userID string, Name string) (string, error)
}