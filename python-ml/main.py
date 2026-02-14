import grpc
from concurrent import futures
import time

from proto import image_analyzer_pb2
from proto import image_analyzer_pb2_grpc

# gRPCのサービスを実装するクラス
class ImageAnalyzerServicer(image_analyzer_pb2_grpc.ImageAnalyzerServicer):
    def AnalyzeImage(self, request, context):
        print(f"Goから画像データを受信しました! サイズ: {len(request.image_data)} bytes")

        # この以下にAI解析ロジックを書いていく
        # 今のこれはテスト用の結果を返す
        return image_analyzer_pb2.AnalyzeResponse(
            product_name="テスト商品",
            vector=[0.1, 0.2, 0.3],
            success=True,
        )
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    # サービスをサーバーに登録する
    image_analyzer_pb2_grpc.add_ImageAnalyzerServicer_to_server(
        ImageAnalyzerServicer(), server
    )

    server.add_insecure_port('[::]:50051')
    print("Python gRPC server started on port 50051...")
    server.start()

    try:
        while True:
            time.sleep(86400)
            
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()