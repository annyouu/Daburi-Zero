"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { motion } from "framer-motion";
import { useSetup } from "../hooks";

export const NameStep = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitName } = useSetup();

  // 送信処理
  const handleNext = async () => {
    // 入力がない、または送信中の場合は何もしない
    if (!name || isSubmitting) return;

    setIsSubmitting(true);
    console.log("=== 名前送信開始 ===");

    try {
      await submitName(name);
      console.log("名前入力に成功！ APIレスポンスに基づき次の画面へ移動しました。");
    } catch (error) {
      console.error("名前送信エラー:", error);
      alert("名前の保存に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* ヘッダー部分 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Step 1</h2>
        <p className="text-gray-600">あなたのニックネームを教えてください</p>
      </div>

      {/* 入力フォーム部分 */}
      <div className="space-y-4">
        <Input
          label="名前"
          placeholder="例: たろう"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting} // 送信中は入力をロック
        />

        {/* 送信ボタン */}
        <button
          onClick={handleNext}
          disabled={!name || isSubmitting} // 入力なし or 送信中は無効化
          className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] ${
            name && !isSubmitting
              ? "bg-[#7C74F7] text-white hover:brightness-110"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>保存中...</span>
            </div>
          ) : (
            "次へ進む"
          )}
        </button>
      </div>
    </motion.div>
  );
};