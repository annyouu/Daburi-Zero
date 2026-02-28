import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, RotateCcw, Check } from "lucide-react";
import { Input } from "@/components/common/Input";
import { useRegisterItem } from "../hooks/useRegisterItem";

const PRESET_CATEGORIES = [
  "食料品",
  "調味料",
  "飲料",
  "日用品",
  "洗濯用品",
  "掃除用品",
  "衛生用品",
  "ヘアケア",
  "スキンケア",
  "その他",
];

type Step = "photo" | "confirm";

const InventoryRegisterForm = () => {
  const navigate = useNavigate();
  const { analyzeForName, register, isAnalyzing, isRegistering, error } = useRegisterItem();

  const [step, setStep] = useState<Step>("photo");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleAnalyze = async () => {
    if (!image) return;
    const name = await analyzeForName(image);
    setProductName(name ?? "");
    setStep("confirm");
  };

  const handleRegister = async () => {
    if (!image || !productName || !category) return;
    const result = await register({ image, name: productName, category });
    if (result) {
      navigate("/inventory");
    }
  };

  const handleRetake = () => {
    setStep("photo");
    setProductName("");
    setCategory("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      {/* ヘッダー */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">在庫を登録する</h2>

        {/* ステップインジケーター */}
        <div className="flex items-center justify-center gap-2">
          {(["写真を撮る", "商品情報を確認"] as const).map((label, i) => {
            const isActive = (i === 0 && step === "photo") || (i === 1 && step === "confirm");
            const isDone = i === 0 && step === "confirm";
            return (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`w-8 h-0.5 transition-colors ${
                      step === "confirm" ? "bg-[#7C74F7]" : "bg-gray-200"
                    }`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-[#7C74F7]/20 text-[#7C74F7]"
                        : isActive
                        ? "bg-[#7C74F7] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? (
                      <Check size={10} strokeWidth={3} />
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isActive ? "text-[#7C74F7]" : isDone ? "text-[#7C74F7]/60" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* コンテンツ */}
      <AnimatePresence mode="wait">
        {step === "photo" ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* 写真プレビューエリア */}
            {previewUrl ? (
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#7C74F7]">
                <img src={previewUrl} alt="商品プレビュー" className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3"
                  >
                    <div className="h-9 w-9 border-4 border-[#7C74F7] border-t-transparent rounded-full animate-spin" />
                    <span className="text-white text-sm font-bold">AI解析中...</span>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gray-50">
                <div className="w-16 h-16 rounded-full bg-[#7C74F7]/10 flex items-center justify-center">
                  <Camera size={28} className="text-[#7C74F7]" />
                </div>
                <p className="text-gray-500 text-sm font-medium">商品の写真を撮影または選択</p>
                <p className="text-gray-400 text-xs">AIが商品名を自動で読み取ります</p>
              </div>
            )}

            {/* カメラ / ライブラリ ボタン */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                disabled={isAnalyzing}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-[#7C74F7] text-[#7C74F7] font-semibold text-sm hover:bg-[#EBE9FF] active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Camera size={18} />
                撮影する
              </button>
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={isAnalyzing}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ImageIcon size={18} />
                ライブラリ
              </button>
            </div>

            {/* 非表示ファイルinput */}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />

            {/* AIで解析するボタン */}
            <AnimatePresence>
              {image && (
                <motion.button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="w-full py-4 font-bold rounded-2xl text-lg bg-[#7C74F7] text-white hover:brightness-110 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      解析中...
                    </span>
                  ) : (
                    "AIで解析する"
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-sm text-red-500 text-center font-medium">{error}</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* 画像プレビュー（小） */}
            {previewUrl && (
              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="商品"
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-100 shadow-sm"
                />
              </div>
            )}

            {/* 商品名 */}
            <Input
              label="商品名"
              type="text"
              placeholder="例: アタック 抗菌EX"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={isRegistering}
              required
            />

            {/* カテゴリ選択 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 ml-1">カテゴリ</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    disabled={isRegistering}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed ${
                      category === cat
                        ? "bg-[#7C74F7] text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-[#EBE9FF] hover:text-[#7C74F7]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center font-medium">{error}</p>
            )}

            {/* 登録ボタン */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleRegister}
                disabled={!productName || !category || isRegistering}
                className={`w-full py-4 font-bold rounded-2xl text-lg transition-all shadow-md active:scale-[0.98] ${
                  productName && category && !isRegistering
                    ? "bg-[#7C74F7] text-white hover:brightness-110"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isRegistering ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    登録中...
                  </span>
                ) : (
                  "在庫に登録する"
                )}
              </button>

              <button
                type="button"
                onClick={handleRetake}
                disabled={isRegistering}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-gray-500 hover:text-[#7C74F7] font-medium transition-colors disabled:opacity-50"
              >
                <RotateCcw size={14} />
                撮り直す
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryRegisterForm;
