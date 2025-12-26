# 認証フロー

Destiny Face 顔マッチングサービスのログイン回りの認証仕様図です。

## 新規登録時 (セッション発行)
sequenceDiagram
    autonumber
    actor User as クライアント
    participant API as Go Backend
    participant DB as PostgreSQL
    participant Redis as Redis (Session Store)

    User->>API: 新規登録リクエスト (name, email, password, etc...)
    Note over API: パスワードをハッシュ化 (Bcrypt)
    API->>DB: ユーザー情報を保存
    DB-->>API: 保存完了 (UserIDを返却)

    Note over API: ここからログイン処理
    Note over API: セッションID (UUID) を生成
    API->>Redis: セッション保存 (Key: session:[ID], Value: UserID, TTL: 24h)
    Redis-->>API: OK
    API-->>User: 登録成功 + セッションIDを返却

## ログイン実行時 (セッション発行)

## 認証が必要なリクエスト時 (Middleware)