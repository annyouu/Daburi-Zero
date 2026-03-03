import grpc
from concurrent import futures
import time
import io

import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

from proto import image_analyzer_pb2
from proto import image_analyzer_pb2_grpc

# AIモデルの準備
# ResNet18を使用。最終層を切り落として「特徴抽出」に特化させる設定
# 最後の分類層を「何もしない層」に置き換えて、512次元の特徴量をそのまま出すようにする
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
models.fc = torch.nn.Identity()
model.eval()

# AIが処理しやすいように画像を加工する
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# gRPCのサービスを実装するクラス
class ImageAnalyzerServicer(image_analyzer_pb2_grpc.ImageAnalyzerServicer):
    def AnalyzeImage(self, request, context):
        try:
            print(f"Goから画像を受信: {len(request.image_data)} bytes")

            # 1. バイナリデータをPIL画像に変換
            image = Image.open(io.BytesIO(request.image_data)).convert('RGB')

            # 2. 前処理 (リサイズや正規化)
            input_tensor = preprocess(image)
            input_batch = input_tensor.unsqueeze(0)

            # 3. 特徴量抽出
            with torch.no_grad():
                output = model(input_batch)

            # 4. 結果をnumpy配列にしてからListに変換 (gRPCで送れる形にする)
            vector = output[0].numpy().tolist()

            print(f"解析完了: {len(vector)} 次元のベクトルを生成しました")

            return image_analyzer_pb2.AnalyzeResponse(
                product_name="解析済みアイテム",
                vector=vector,
                success=True,
            )


        except Exception as e:
            print(f"エラー発生 :{e}")
            return image_analyzer_pb2.AnalyzeResponse(
                success=False,
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    image_analyzer_pb2_grpc.add_ImageAnalyzerServicer_to_server(
        ImageAnalyzerServicer(), server
    )

    server.add_insecure_port('[::]:50051')
    print("🚀 Python ML Server started on port 50051...")
    server.start()

    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()