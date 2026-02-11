package s3

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"destinyface/internal/domain/repository"
	"github.com/aws/aws-sdk-go-v2/aws"
	aws_s3 "github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type s3Storage struct {
	client *aws_s3.Client
	bucket string
}

func NewS3Storage(client *aws_s3.Client, bucket string) repository.FileStorageInterface {
	return &s3Storage{
		client: client,
		bucket: bucket,
	}
}

func (s *s3Storage) Upload(ctx context.Context, file io.Reader, userID string, Name string) (string, error) {
	// ファイル名をUUIDに変更 (重複回避)
	ext := filepath.Ext(Name)
	if ext == "" {
		ext = ".jpg"
	}
	newFileName := uuid.New().String() + ext

	// パスの組み立て (users/{user_id}/{uuid}.jpg)とする
	safeUserID := strings.ReplaceAll(userID, "/", "")
	finalKey := fmt.Sprintf("users/%s/%s", safeUserID, newFileName)

	// MinIO/S3へアップロードする
	_, err := s.client.PutObject(ctx, &aws_s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key: aws.String(finalKey),
		Body: file,
	})

	if err != nil {
		return "", fmt.Errorf("S3へのアップロードに失敗しました： %w", err)
	}

	// フルURLの組み立て
	endpoint := os.Getenv("AWS_S3_ENDPOINT")
	if endpoint == "" {
		return "", fmt.Errorf("AWS_S3_ENDPOINT が設定されていません")
	}

	endpoint = strings.TrimSuffix(endpoint, "/")
	// URL形式: http://localhost:9000/destiny-bucket/users/123/uuid.jpg
	fullURL := fmt.Sprintf("%s/%s/%s", endpoint, s.bucket, finalKey)

	return fullURL, nil
}