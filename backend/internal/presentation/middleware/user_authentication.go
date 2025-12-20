// リクエストのJWTを検証し、有効な場合にuserIDをContextにセットするミドルウェア
package middleware

import (
	// "fmt"
	"net/http"
	"strings"

	"destinyface/internal/infrastructure/auth"

	"github.com/gin-gonic/gin"
)

func UserAuthentication(jwtService auth.JWTServiceInterface) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Authorizationヘッダーの取得
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorizationヘッダーは必須です",
			})
			c.Abort()
			return
		}

		// fmt.Println("authHeader:", authHeader)

		// "Bearer <token>" 形式の分解とバリデーション
		// Splitすると ["Bearer", "{token}"] というスライスになる想定
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header format must be Bearer {token}",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// JWTの検証 (Infra層のJWTServiceのメソッドを呼び出す)
		userID, err := jwtService.ValidateToken(tokenString)

		// 検証失敗 (改ざんなどの可能性あり)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "JWTの検証に失敗しました",
			})
			c.Abort()
			return
		}

		// 成功なら
		// ControllerでUserIDを使用できるようにする
		c.Set("userID", userID)

		c.Next()
	}
}
