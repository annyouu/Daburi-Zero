# API仕様書 (V3.0)

1. 認証・アカウント系 (/auth)
- POST /auth/register: 新規会員登録。セッションを作成し、Cookieをセットする。
- POST /auth/login: ログイン。セッションを作成し、Cookieをセットする。
- POST /auth/logout: ログアウト。サーバー側のセッション（Redis）を削除し、Cookieを破棄する。

2. ユーザープロフィール・セットアップ系 (/users)
- GET /users/me: 自分のプロフィール情報の取得。
- PATCH /users/me: ニックネームやステータスなどの基本情報更新。
- PATCH /users/setup/name: 新規登録直後のニックネーム設定。ステータスを PENDING_IMAGE 等へ進行させる。
- PATCH /users/setup/image: 新規登録直後の顔画像登録。ステータスを PENDING_IMAGEからACTIVEへ。

<!-- 3. 顔類似検索系 (/matches)
- POST /matches/search: 検索用画像のアップロードと類似検索の実行。
    - リクエスト: multipart/form-data (画像ファイル)。
    - レスポンス: 類似度スコア付きユーザーリスト。 -->

3. 在庫管理(CRUD)系 (/inventory)
- GET /inventory: 自分の持っている在庫一覧を取得。
- POST /inventory/register: 新規登録 (撮影)。
    - 挙動: Goが画像を受け取り → MinIO(S3)に保存 → Python(gRPC)でベクトル化 ＆ OCRで商品名抽出 → pgvector(DB)に保存。
- GET /inventory/{itemId}: 商品の詳細（登録日や画像URL）取得。
- PATCH /inventory/{itemId}: 商品名やメモの手動修正。
- DELETE /inventory/{itemId}: 使い切った、または捨てた商品を削除。


4. 店頭照合(検索)系 (/analyze)
- POST /analyze: 店頭で撮った画像を送る。
    - 挙動: 画像を一時的に受け取り → Python(gRPC)でベクトル化 → DB内の自分の在庫とベクトル類似度検索。
    -  期待するレスポンス:
        - match_found: boolean (似ているものがあるか)
        - similarity: float (類似度)
        - matched_item: 似ている商品の情報（画像URL、商品名）

<!-- 5. 画像配信系 (/images)
- GET /images/{fileName}: サーバーまたはストレージに保存された画像を表示。
    - 注意：S3等の外部ストレージ利用時は、各APIのレスポンス（profile_image_url 等）に署名付きURLを直接含める運用を考える必要あり。 -->