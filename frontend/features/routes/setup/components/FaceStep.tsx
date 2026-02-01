"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetup } from "../hooks";

export const FaceStep = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { submitImage } = useSetup();

  // 内部状態
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 以前のプレビューがあれば解放
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleComplete = async () => {
    if (!image || isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log("=== 画像アップロード開始 ===");
      await submitImage(image);
      console.log("セットアップ完了！");
    } catch (error) {
      console.error("アップロード失敗:", error);
      alert("画像のアップロードに失敗しました。再度お試しください。");
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
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Step 2</h2>
        <p className="text-gray-600">プロフィール写真を設定しましょう</p>
      </div>

      <div className="space-y-4">
        {/* 画像選択エリア */}
        <div
          onClick={() => !isSubmitting && fileInputRef.current?.click()}
          className={`relative w-full aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all overflow-hidden ${
            previewUrl 
              ? "border-[#7C74F7] bg-white" 
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              {/* 重ねて「変更する」ボタンを表示 */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">変更する</span>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="mb-3 text-[#7C74F7] bg-[#7C74F7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-gray-600 font-bold">画像をアップロード</p>
              <p className="text-gray-400 text-xs mt-2">カメラロールやファイルから選択</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleComplete}
            disabled={!image || isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md active:scale-[0.98] ${
              image && !isSubmitting
                ? "bg-[#7C74F7] text-white hover:brightness-110"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>登録中...</span>
              </div>
            ) : (
              "登録を完了する"
            )}
          </button>
          
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full py-2 text-sm text-gray-500 hover:text-[#7C74F7] font-medium transition-colors"
          >
            ← 名前入力に戻る
          </button>
        </div>
      </div>
    </motion.div>
  );
};