// リクエストのJWTを検証し、有効な場合にuserIDをContextにセットするミドルウェア
package middleware

import (
	"net/http"
	"strings"

	"destinyface/internal/contextkey"
	"destinyface/internal/domain/repository"

	"github.com/gin-gonic/gin"
)

func UserAuthentication(sessionRepo repository.SessionRepositoryInterface) gin.HandlerFunc {
	return func(c *gin.Context) {
		// AuthorizationヘッダーからセッションIDを取得する (Bearer <session_id>)
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "認証ヘッダーが必要です",
			})
			c.Abort()
			return
		}

		// Bearerの部分を無くす
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "認証形式が正しくないです",
			})
			c.Abort()
			return
		}
		sessionID := parts[1]

		// JWTの解読ではなく、Redis(sessionRepo)でUserIDに問い合わせる
		userID, err := sessionRepo.GetUserID(c.Request.Context(), sessionID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "認証処理中にエラーが発生しました",
			})
			c.Abort()
			return
		}

		// UserIDがない
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "セッションが切れているか無効です",
			})
			c.Abort()
			return
		}

		// 取得したUserIDをContextにセットする
		c.Set(contextkey.UserID, userID)
		c.Next()
	}
}
