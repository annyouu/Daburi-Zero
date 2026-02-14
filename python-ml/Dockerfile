FROM python:3.11-slim

WORKDIR /app

# 必要なライブラリをコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ソースコードをコピー
COPY . .

# サーバー起動
CMD ["python", "main.py"]