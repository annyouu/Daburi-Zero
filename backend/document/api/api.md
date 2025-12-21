<!-- api仕様書を考える -->

1. 認証、アカウント系 (/auth)
- POST /auth/signup: 新規会員登録。JWTを発行
- POST /auth/login: ログイン。JWTを発行
- POST /auth/louout: ログアウト

2. ユーザープロフィール系 (/users)
- GET /users/me: 自分のプロフィール情報の取得
- PATCH /users/me: ニックネームや顔画像などの基本情報更新
- POST /users/me/face: 自身の顔写真の登録、更新
    - Goが画像を受け取り → PythonへgRPCで送信 → Embeddingを取得 → DB（pgvector）に保存

3. 顔類似検索系 (/matches)
- POST /matches/search: 検索用画像のアップロードと検索実行
    - リクエスト: multipart/form-data（検索したい顔画像）
    - レスポンス: 類似度順のユーザーリスト (ID,ニックネーム,サムネイルURL,類似度スコア)
    - 動き: 入力画像からEmbedding生成 → DBでベクトル近似検索
- GET /matches/users/{userId}: 検索結果から特定の相手の詳細を確認できる

4. メッセージ系 (/messages)
- GET /messages/rooms: チャット一覧（誰とやり取りしているか）の取得
- GET /messages/rooms/{userId}: 特定の相手とのメッセージ履歴の取得
- POST /messages: メッセージの送信
- GET /messages/limit: 今日の残り送信可能枠数（0〜3）を取得（フロントでボタンをグレーアウトするために使用）

5. 静的ファイル、画像系
- GET /images/{fileName}: アップロードされた顔写真の取得 (S3などのクラウドストレージに保存する場合)は、別途そのURLを取得するAPIが必要。