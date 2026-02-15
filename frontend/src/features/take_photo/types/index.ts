/**
 * 解析結果のレスポンス
 */
export interface AnalyzeResponse {
  product_name: string;
  vector: number[];
  success: boolean;
}

/**
 * 解析エラーのレスポンス
 */
export interface AnalyzeError {
    message: string;
}