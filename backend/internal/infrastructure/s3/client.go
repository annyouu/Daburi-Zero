package s3

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	aws_s3 "github.com/aws/aws-sdk-go-v2/service/s3"
)

// S3/Minioクライアントを初期化する
func NewS3Client(ctx context.Context) (*aws_s3.Client, error) {
	endpoint := os.Getenv("AWS_S3_ENDPOINT")
	region := os.Getenv("AWS_REGION")

	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")

	// まずデフォルト設定をロードする
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(region),
		// MinIOのIDとパスワードをセットする
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
	)
	if err != nil {
		return nil, err
	}

	// S3クライアントを作成し、エンドポイントを直接指定する
	client := aws_s3.NewFromConfig(cfg, func(o *aws_s3.Options) {
		if endpoint != "" {
			o.BaseEndpoint = aws.String(endpoint)
			o.UsePathStyle = true
		}
	})

	return client, nil
}