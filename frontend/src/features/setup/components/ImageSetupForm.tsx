import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetupImage } from "../hooks/useSetupImage";

export const ImageSetupForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { handleSetupImage, isLoading, error } = useSetupImage();

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleComplete = async () => {
    if (!image || isLoading) return;

    const result = await handleSetupImage(image);
    
    if (result) {
      console.log("セットアップ完了！");
      navigate("/home");
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
        <h2 className="text-2xl font-bold text-gray-900">Step 3</h2>
        <p className="text-gray-600">プロフィール写真を設定しましょう</p>
      </div>

      <div className="space-y-4">
        {/* 画像選択エリア */}
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`relative w-full aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all overflow-hidden ${
            previewUrl 
              ? "border-[#7C74F7] bg-white" 
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm text-gray-900">変更する</span>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="mb-3 text-[#7C74F7] bg-[#7C74F7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

        {error && <p className="text-sm text-center text-red-500 font-medium">{error}</p>}

        <div className="space-y-3">
          <button
            onClick={handleComplete}
            disabled={!image || isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md active:scale-[0.98] ${
              image && !isLoading
                ? "bg-[#7C74F7] text-white hover:brightness-110"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>登録中...</span>
              </div>
            ) : (
              "登録を完了する"
            )}
          </button>
          
          <button
            onClick={() => navigate("/setup/name")}
            disabled={isLoading}
            className="w-full py-2 text-sm text-gray-500 hover:text-[#7C74F7] font-medium transition-colors"
          >
            ← 名前入力に戻る
          </button>
        </div>
      </div>
    </motion.div>
  );
};