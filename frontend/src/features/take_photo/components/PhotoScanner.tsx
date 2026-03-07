import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ──────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────
export const PhotoScanner = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    // 同じファイルを再選択できるようリセット
    e.target.value = "";
  };

  const handleAnalyze = () => {
    if (selectedFile && preview) {
      navigate("/analyze", { state: { previewUrl: preview } });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <>
      {/* ── トリガーカード ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-8 space-y-6 bg-white rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">あれ、あったっけ？</h2>
          <p className="text-gray-500 text-sm">撮影して確かめましょう</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full py-4 px-4 font-bold rounded-3xl text-lg bg-[#7C74F7] text-white hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
        >
          撮影して確認する
        </button>
      </motion.div>

      {/* ── モーダル（中央） ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景オーバーレイ */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* ダイアログ本体 */}
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center px-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            >
              <div
                className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
              {/* ヘッダー */}
              <div className="flex items-center justify-between px-6 py-4">
                <h3 className="font-bold text-gray-900 text-lg">照合する</h3>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 pb-6 space-y-5">
                {/* 選択ボタン */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 border-[#7C74F7] text-[#7C74F7] font-semibold text-sm hover:bg-[#EBE9FF] active:scale-[0.97] transition-all"
                  >
                    <Camera size={24} />
                    撮影する
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 active:scale-[0.97] transition-all"
                  >
                    <ImageIcon size={24} />
                    画像を選ぶ
                  </button>
                </div>

                {/* 非表示ファイルinput */}
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
                <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

                {/* プレビュー */}
                <AnimatePresence>
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative rounded-2xl overflow-hidden border border-gray-100 max-h-52"
                    >
                      <img src={preview} alt="プレビュー" className="w-full object-cover" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 確認するボタン */}
                <AnimatePresence>
                  {selectedFile && (
                    <motion.button
                      type="button"
                      onClick={handleAnalyze}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="w-full py-3.5 font-bold rounded-2xl text-base bg-[#7C74F7] text-white hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                      確認する
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
