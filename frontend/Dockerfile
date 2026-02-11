FROM node:20-alpine

WORKDIR /app

# キャッシュを効率化するため先に package ファイルのみコピー
COPY package.json package-lock.json ./

RUN npm install

# 全ファイルをコピー
COPY . .

# Vite の開発サーバーをホスト 0.0.0.0 で起動（外部アクセス許可）
CMD ["npm", "run", "dev", "--", "--host"]