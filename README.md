# 顔マッチングサービス — 仕様書
## 概要
このサービスは、オーストラリアの「ペットと里親の顔マッチング」アプリの着想を得て、人間版として実装するものです。人はこの世にドッペルゲンガーがいると言われます。ユーザーがアップロードした顔画像をもとに、「似ている他のユーザー」を検出・提示し、簡易チャットでつながれる Web アプリケーションです。
顔特徴量の抽出には Python の ML ライブラリ（例: insightface / facenet-pytorch）を使用する。最初はローカル CPU、必要に応じて GPU に移行。
顔特徴の抽出サービス（Python）とアプリケーションロジック（Go）は gRPC で接続する。
フロントエンドは Next.js + TypeScript を想定（Web メイン）。将来 Flutter / Swift に移植する予定。

# 1.要件サマリ
## 機能 (MVP)
- ユーザー登録/ログイン
- 顔画像のアップロード
- 顔特徴量(embedding)の生成、保存
- 類似ユーザーの検索
- 類似度スコアの表示
- 類似ユーザーとのチャット(WebSocket)


# 2. 全体図
```bash
[Frontend (Next.js + TS)] <--- HTTPS / WebSocket ---> [API Gateway / Go Backend]
                                                        ^
                                                        |
                                                        | gRPC
                                                        v
                                                        [Face Service (Python)]
                                                        |
                                                        v
                                                        [Postgres + pgvector]
```

# 2-add. アーキテクチャ詳細 (クリーンアーキテクチャ & DDD の採用)


# 3. フロントエンド仕様 (Next.js+TypeScript)
## 主要ページ
- /singup, /login
- /profile：プロフィール編集 (名前、写真、公開範囲)
- /upload：顔写真アップロード
- /matches：類似ユーザー一覧 (スコア、サムネイル、チャットボタン)
- /chat/[userId]：チャット画面

## なぜNext.jsを採用するか、Reactとの比較

## TypeScriptを採用する理由

# 4. バックエンド仕様 (Go)

# 5. 顔認証/顔類似性サービス (Python)

# 6. API仕様書 (REST for frontend, gRPC for service間)

# 7. DBデータモデル



