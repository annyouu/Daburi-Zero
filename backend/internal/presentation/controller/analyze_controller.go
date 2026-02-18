package controller

import (
	"io"
	"net/http"
	"github.com/gin-gonic/gin"
	"destinyface/internal/usecase"
)

type AnalyzeHandler struct {
	analyzeUseCase usecase.AnalyzeUseCaseInterface
}

func NewAnalyzeHandler(u usecase.AnalyzeUseCaseInterface) *AnalyzeHandler {
	return &AnalyzeHandler{
		analyzeUseCase: u,
	}
}

func (h *AnalyzeHandler) Analyze(c *gin.Context) {
	// 1. Multipart Formから画像を取得
	file, _, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "画像がありません",
		})
		return
	}
	defer file.Close()

	// 2. バリデーション (サイズチェック)
	imageData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "読み込みに失敗しました",
		})
		return
	}

	// 3. UseCase実行
	res, err := h.analyzeUseCase.Execute(c.Request.Context(), imageData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "解析中に失敗しました",
		})
		return
	}

	c.JSON(http.StatusOK, res)
}