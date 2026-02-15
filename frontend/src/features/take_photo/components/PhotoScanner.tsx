import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhotoAnalysis } from "../hooks/usePhotoAnalysis";

export const PhotoScanner = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyze, isLoading, result, error } = usePhotoAnalysis();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    analyze(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full p-8 space-y-8 bg-white rounded-3xl shadow-xl border border-gray-100"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">あれ、あったっけ？</h2>
        <p className="text-gray-800">撮影して確かめましょう</p>
      </div>

      <div className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`
            w-full py-4 px-4 font-bold rounded-3xl text-lg transition-all shadow-md
            active:scale-[0.98]
            ${
              !isLoading
                ? "bg-[#7C74F7] text-white hover:brightness-110"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>解析中...</span>
            </div>
          ) : (
            "撮影する"
          )}
        </button>

        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-3xl overflow-hidden border border-gray-200"
            >
              <img
                src={preview}
                alt="プレビュー"
                className="w-full object-cover"
              />

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4"
                >
                  <div className="h-10 w-10 border-4 border-[#7C74F7] border-t-transparent rounded-full animate-spin" />
                  <span className="text-white text-lg font-bold">
                    AI解析中...
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-center font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && result.success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-3"
            >
              <h3 className="text-lg font-bold text-[#7C74F7]">解析結果</h3>
              <p className="text-gray-900 font-medium">
                商品名: {result.product_name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
