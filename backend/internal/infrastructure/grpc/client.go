package grpc

import (
	"context"

	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "destinyface/gen/proto"
)

type ImageAnalyzerClient struct {
	client pb.ImageAnalyzerClient
	conn *grpc.ClientConn
}

// 接続を保持したクライアントを作成する
func NewImageAnalyzerClient(target string) (*ImageAnalyzerClient, error) {
	conn, err := grpc.Dial(target, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	return &ImageAnalyzerClient{
		client: pb.NewImageAnalyzerClient(conn),
		conn: conn,
	}, nil
}

func (c *ImageAnalyzerClient) Close() error {
	return c.conn.Close()
}

// 5秒のタイムアウトを設定して解析を行う
func (c *ImageAnalyzerClient) AnalyzeImage(ctx context.Context, imageData []byte) (*pb.AnalyzeResponse, error) {
	// AI解析が重い場合,5秒で落とす
	timeoutCtx, cancel := context.WithTimeout(ctx, 5 * time.Second)
	defer cancel()

	req := &pb.AnalyzeRequest{
		ImageData: imageData,
	}

	// 作成したtimeoutCtxを渡して実行する
	return c.client.AnalyzeImage(timeoutCtx, req)
}