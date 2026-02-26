import cv2
import numpy as np
import os

def test_image_logic(image_path):
    # 1. 画像の読み込み
    if not os.path.exists(image_path):
        print(f"エラー: {image_path} が見つかりません。")
        return

    # OpenCVで画像を読み込む (BGR形式)
    img = cv2.imread(image_path)
    
    # 2. 画像の正体（行列）を確認
    # shapeは (高さ, 幅, 色の数)
    print(f"--- 1. 画像の基本情報 ---")
    print(f"行列の形 (shape): {img.shape}")
    print(f"データ型 (dtype): {img.dtype}")
    print(f"左上隅ピクセルのRGB値: {img[0, 0]}\n")

    # 3. グレースケール化（情報の圧縮）
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 4. エッジ抽出（輪郭を際立たせる）
    # 100, 200はしきい値。これを超える色の変化を「線」とみなす
    edges = cv2.Canny(gray, 100, 200)

    # 5. 結果の保存（目で見て確認するため）
    cv2.imwrite("result_gray.jpg", gray)
    cv2.imwrite("result_edges.jpg", edges)

    print(f"--- 2. 解析結果 ---")
    print(f"全ピクセル数: {edges.size}")
    print(f"エッジ（白い点）の数: {np.sum(edges > 0)}")
    print(f"エッジの割合: {np.sum(edges > 0) / edges.size * 100:.2f}%")
    print("\n結果画像を 'result_edges.jpg' として保存しました。")

if __name__ == "__main__":
    # ここにテストしたい画像ファイル名を指定
    test_image_logic("test_image.jpg")