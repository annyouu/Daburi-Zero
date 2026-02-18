package usecase

import (
	"context"
	"destinyface/internal/infrastructure/grpc"
	pb "destinyface/gen/proto"
)

type AnalyzeUseCaseInterface interface {
	Execute(ctx context.Context, imageData []byte) (*pb.AnalyzeResponse, error)
}

type analyzeUseCase struct {
	grpcClient *grpc.ImageAnalyzerClient
}

func NewAnalyzeUseCase(client *grpc.ImageAnalyzerClient) AnalyzeUseCaseInterface {
	return &analyzeUseCase{
		grpcClient: client,
	}
}

func (u *analyzeUseCase) Execute(ctx context.Context, imageData []byte) (*pb.AnalyzeResponse, error) {
	return u.grpcClient.AnalyzeImage(ctx, imageData)
}