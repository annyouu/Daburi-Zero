package grpc

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "destinyface/gen/proto"
)

// PythonのMLサーバーに画像を投げて解析結果をもらうメソッド
func AnalyzeImageWithPython(imageData []byte) (*pb.AnalyzeResponse, error) {
	// Pythonサーバーへの接続設定
	conn, err := grpc.Dial("python-ml:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	defer conn.Close()

	client := pb.NewImageAnalyzerClient(conn)

	// タイムアウト付きのコンテキストを作成
	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()

	// リクエストを送信
	req := &pb.AnalyzeRequest{
		ImageData: imageData,
	}

	log.Println("Python MLサーバーにリクエストを送信中...")
	res, err := client.AnalyzeImage(ctx, req)
	if err != nil {
		return nil, err
	}

	return res, nil

}
