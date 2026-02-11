// データベース接続の確立
package persistence

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// データベース接続の初期化
func InitDB() (*sql.DB, error) {
	dbURL := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	// 接続の確立
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("データベースの接続に失敗しました: %w", err)
	}

	// 接続の確認
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("PostgreSQLへのPingに失敗しました: %w", err)
	}

	createTableQuery := `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        profile_image_url TEXT,
        status VARCHAR(50) DEFAULT 'PENDING_NAME',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`

	if _, err := db.ExecContext(ctx, createTableQuery); err != nil {
		db.Close()
        return nil, fmt.Errorf("usersテーブルの作成に失敗しました: %w", err)
	}
	log.Println("✅ usersテーブルの準備が完了しました")

	// 接続プールの設定
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	log.Println("PostgreSQL接続に成功しました")
	return db, nil
}

