# 認証フロー
Destiny Face 顔マッチングサービスの認証・認可フロー図です。本システムでは Redis を使用したセッション管理方式を採用しています。

## 新規登録時 (セッション発行)
ユーザー作成と同時にログイン状態へ移行するためのフローです。
```mermaid
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

    Note over API: ログイン処理も併用
    Note over API: セッションID (UUID) を生成
    API->>Redis: セッション保存 (Key: session:[ID], Value: UserID, TTL: 24h)
    Redis-->>API: OK
    API-->>User: 登録成功 + セッションIDを返却
```

## ログイン実行時 (セッション発行)
既存ユーザーの認証を行い、新規セッションを開始するフローです。
```mermaid
sequenceDiagram
    autonumber
    actor User as クライアント
    participant API as Go Backend
    participant DB as PostgreSQL
    participant Redis as Redis (Session Store)

    User->>API: ログインリクエスト (email, password)
    API->>DB: ユーザー検索 (email)
    DB-->>API: ユーザーデータ (ハッシュ化パスワード含む)

    Note over API: パスワード照合 (CompareHashAndPassword)

    alt 認証成功
        Note over API: セッションID (UUID) を生成
        API->>Redis: セッション保存 (Key: session:[ID], Value: UserID, TTL: 24h)
        Redis-->>API: OK
        API-->>User: ログイン成功 + セッションIDを返却
    else 認証失敗
        API-->>User: 401 Unauthorized (パスワード不一致など)
    end
```

## 認証が必要なリクエスト時 (Middleware)
保護されたリソースへアクセスする際、セッションが有効かどうかを検証するフローです。
```mermaid
sequenceDiagram
    autonumber
    actor User as クライアント
    participant Mid as Auth Middleware
    participant Redis as Redis
    participant Handler as Protected Handler

    User->>Mid: GET /me (SessionID)
    Mid->>Redis: GET session:[ID]

    alt セッション有効
        Redis-->>Mid: UserID
        Note over Mid: context に UserID をセット
        Mid->>Handler: 次の処理へ
        Handler->>Redis: (必要に応じて) ユーザー情報取得
        Handler-->>User: 200 OK + ユーザー詳細
    else セッション無効 / 期限切れ
        Redis-->>Mid: nil
        Mid-->>User: 401 Unauthorized
    end
```