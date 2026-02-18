package main

import (
	"context"
	"log"
	"os"
	"time"

	"destinyface/internal/infrastructure/persistence"
	"destinyface/internal/infrastructure/redis"

	// "destinyface/internal/infrastructure/storage"
	"destinyface/internal/infrastructure/s3"
	"destinyface/internal/presentation/controller"
	"destinyface/internal/presentation/middleware"

	// "destinyface/internal/presentation/middleware"
	"destinyface/internal/usecase"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	goredis "github.com/redis/go-redis/v9"

	"destinyface/internal/infrastructure/grpc"
)

func main() {
	// 1. 環境変数の読み込み
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// 2. DB接続
	db, err := persistence.InitDB()
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()
	log.Println("✅ Database connected")

	// gRPC通信テスト
	// log.Println("gRPC通信テストを開始します...")
	// go func() {
	// 	// サーバー起動と重なると接続失敗しやすいので、少しだけ待つ
    //     time.Sleep(3 * time.Second)
        
    //     dummyImage := []byte{0x89, 0x50, 0x4E, 0x47} // ダミーの画像データ
    //     res, err := grpc.AnalyzeImageWithPython(dummyImage)
    //     if err != nil {
    //         log.Printf("❌ gRPCテスト失敗: %v", err)
    //     } else {
    //         log.Printf("✨ gRPCテスト成功! Pythonからの返答: %s (Success: %v)", res.ProductName, res.Success)
    //     }
	// }()

	// gRPCクライアントの初期化
	// 接続先はDocker Composeのサービス名 "python-ml:50051"
	grpcClient, err := grpc.NewImageAnalyzerClient("python-ml:50051")
	if err != nil {
		log.Fatalf("gRPC clientの初期化に失敗しました: %v", err)
	}
	defer grpcClient.Close() // プログラム終了時に接続を終える
	log.Println("✅ gRPC ML Server connected")

	// Redisクライアントの初期化を追加
	rdb := goredis.NewClient(&goredis.Options{
        Addr:     "redis:6379", 
        Password: "",
        DB: 0,
    })
	
	sessionRepo := redis.NewSessionRepository(rdb)

	// 4. 各層の依存注入 (DI)
	userRepo := persistence.NewUserRepository(db) 
	userUseCase := usecase.NewUserUseCase(userRepo, sessionRepo)
	userHandler := controller.NewUserHandler(userUseCase)

	// profileRepo := storage.NewLocalStorage("./uploads")
	
	// MinIOストレージに保存するフェーズ
	// MinIOクライアントの初期化
	ctx := context.Background()
	s3Client, err := s3.NewS3Client(ctx)
	if err != nil {
		log.Fatalf("S3 clientの作成に失敗した: %v", err)
	}

	// パケット名を指定
	bucketName := os.Getenv("AWS_S3_BUCKET_NAME")
	if bucketName == "" {
		bucketName = "test-bucket"
	}
	profileRepo := s3.NewS3Storage(s3Client, bucketName)

	profileUseCase := usecase.NewProfileUseCase(userRepo, profileRepo)
	profileHandler := controller.NewProfileHandler(profileUseCase)

	// 画像解析用のユースケースの追加
	analyzeUseCase := usecase.NewAnalyzeUseCase(grpcClient)
	analyzeController := controller.NewAnalyzeHandler(analyzeUseCase)

	// 5. サーバー設定 (Gin)
	r := gin.Default()

	// CORS設定
	r.Use(cors.New(cors.Config{
		// フロントエンドのURLを許可
        AllowOrigins: []string{"http://localhost:5173"},
        // 許可するHTTPメソッド
        AllowMethods: []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
        // 許可するヘッダー
        AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
        // Cookieなどの認証情報を許可
        AllowCredentials: true,
        // OPTIONSリクエストの結果をキャッシュする時間
        MaxAge: 12 * time.Hour,
	}))

	// --- ルーティング ---
	
	// A. 認証不要ルート
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", userHandler.Register)
		authGroup.POST("/login", userHandler.Login)
	}

	// B. 認証必須ルート (ミドルウェアを適用)
	userGroup := r.Group("/users")

	// jwtServiceではなく、作成したsessionRepoを渡すように変更する
	userGroup.Use(middleware.UserAuthentication(sessionRepo))
	{
		userGroup.GET("/me", userHandler.GetProfile)
		userGroup.PATCH("/me", userHandler.UpdateProfile)

		// 追加
		userGroup.PATCH("/setup/name", userHandler.SetupName)
		userGroup.PATCH("/setup/image", profileHandler.SetupImage)

		// 画像解析エンドポイント
		userGroup.POST("/analyze", analyzeController.Analyze)
	}

	// 6. 起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("🚀 Server started on :%s", port)
	r.Run(":" + port)
}