package grpc

import (
	"context"

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

func (c *ImageAnalyzerClient) AnalyzeImage(ctx context.Context, imageData []byte) (*pb.AnalyzeResponse, error) {
	req := &pb.AnalyzeRequest{
		ImageData: imageData,
	}

	return c.client.AnalyzeImage(ctx, req)
}

// // PythonのMLサーバーに画像を投げて解析結果をもらうメソッド
// func AnalyzeImageWithPython(imageData []byte) (*pb.AnalyzeResponse, error) {
// 	// Pythonサーバーへの接続設定
// 	conn, err := grpc.Dial("python-ml:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
// 	if err != nil {
// 		return nil, err
// 	}

// 	defer conn.Close()

// 	client := pb.NewImageAnalyzerClient(conn)

// 	// タイムアウト付きのコンテキストを作成
// 	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
// 	defer cancel()

// 	// リクエストを送信
// 	req := &pb.AnalyzeRequest{
// 		ImageData: imageData,
// 	}

// 	log.Println("Python MLサーバーにリクエストを送信中...")
// 	res, err := client.AnalyzeImage(ctx, req)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return res, nil

// }
