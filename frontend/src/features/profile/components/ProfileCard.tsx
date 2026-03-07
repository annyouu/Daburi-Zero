import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Check,
  X,
  Mail,
  Calendar,
  Package,
  Eye,
  EyeOff,
  LogOut,
  Camera,
} from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";

// ── Sub components ─────────────────────────────────────────────────────────

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl outline-none transition-all focus:border-[#7C74F7] focus:ring-4 focus:ring-[#7C74F7]/10 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

// ── Main component ─────────────────────────────────────────────────────────

const ProfileCard = () => {
  const { user, isLoading, updateName, updateImage, updatePassword, logout } = useProfile();

  // 名前編集
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  // 画像アップロード
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageError(false);
  }, [user?.profile_image_url]);

  // パスワード変更
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleStartEditName = () => {
    setNameInput(user?.name ?? "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setNameSaving(true);
    const ok = await updateName(nameInput.trim());
    setNameSaving(false);
    if (ok) setIsEditingName(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    await updateImage(file);
    setImageUploading(false);
    e.target.value = "";
  };

  const handlePasswordSave = async () => {
    setPwError(null);
    if (newPw !== confirmPw) {
      setPwError("新しいパスワードが一致しません");
      return;
    }
    if (newPw.length < 8) {
      setPwError("パスワードは8文字以上にしてください");
      return;
    }
    setPwSaving(true);
    const ok = await updatePassword({ current_password: currentPw, new_password: newPw });
    setPwSaving(false);
    if (ok) {
      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => {
        setIsPasswordOpen(false);
        setPwSuccess(false);
      }, 1500);
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordOpen(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-4 border-[#7C74F7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── プロフィールカード ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="h-20 bg-linear-to-br from-[#7C74F7] to-[#B8A9FF]" />

        <div className="px-6 pb-6 -mt-12 space-y-4">
          {/* アバター */}
          <div className="flex justify-center">
            <div
              className="relative w-20 h-20 rounded-full border-4 border-white shadow-md cursor-pointer group"
              onClick={() => !imageUploading && imageInputRef.current?.click()}
            >
              {user?.profile_image_url && !imageError ? (
                <img
                  src={user.profile_image_url}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#EBE9FF] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#7C74F7]">
                    {user?.name?.[0] ?? "?"}
                  </span>
                </div>
              )}
              <div
                className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity ${
                  imageUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {imageUploading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={18} className="text-white" />
                )}
              </div>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* 名前（インライン編集） */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              {isEditingName ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 w-full"
                >
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    disabled={nameSaving}
                    autoFocus
                    className="flex-1 px-3 py-2 border border-[#7C74F7] rounded-xl text-base font-semibold text-gray-900 text-center outline-none focus:ring-4 focus:ring-[#7C74F7]/10 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={!nameInput.trim() || nameSaving}
                    className="w-8 h-8 rounded-full bg-[#7C74F7] text-white flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 shrink-0"
                  >
                    {nameSaving ? (
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    disabled={nameSaving}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 active:scale-95 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl font-bold text-gray-900">{user?.name}</span>
                  <button
                    onClick={handleStartEditName}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#EBE9FF] hover:text-[#7C74F7] active:scale-95 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* メールアドレス */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <Mail size={16} className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>

          {/* 登録日 */}
          {user?.created_at && (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600">
                {formatDate(user.created_at)} に登録
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── 統計カード ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <h3 className="text-sm font-semibold text-gray-500 mb-3">登録数</h3>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#EBE9FF] flex items-center justify-center shrink-0">
            <Package size={18} className="text-[#7C74F7]" />
          </div>
          <div>
            {/* TODO: GET /items からアイテム数を取得 */}
            <p className="text-2xl font-bold text-gray-900">—</p>
            <p className="text-xs text-gray-500">登録中の在庫</p>
          </div>
        </div>
      </motion.div>

      {/* ─── セキュリティカード（パスワード変更） ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">セキュリティ</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">パスワード</p>
              <p className="text-sm text-gray-400 mt-0.5 tracking-widest">••••••••</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPasswordOpen(!isPasswordOpen)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 border-[#7C74F7] text-[#7C74F7] hover:bg-[#EBE9FF] active:scale-[0.97] transition-all"
            >
              変更
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isPasswordOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 space-y-4 border-t border-gray-100">
                {pwSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 py-4 text-emerald-500 font-semibold"
                  >
                    <Check size={18} />
                    パスワードを変更しました
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-3 pt-2">
                      <PasswordField
                        label="現在のパスワード"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        show={showCurrentPw}
                        onToggle={() => setShowCurrentPw(!showCurrentPw)}
                        disabled={pwSaving}
                        placeholder="••••••••"
                      />
                      <PasswordField
                        label="新しいパスワード"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        show={showNewPw}
                        onToggle={() => setShowNewPw(!showNewPw)}
                        disabled={pwSaving}
                        placeholder="8文字以上"
                      />
                      <PasswordField
                        label="新しいパスワード（確認）"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        disabled={pwSaving}
                        placeholder="もう一度入力"
                      />
                    </div>

                    {pwError && (
                      <p className="text-sm text-red-500 font-medium">{pwError}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePasswordSave}
                        disabled={!currentPw || !newPw || !confirmPw || pwSaving}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                          currentPw && newPw && confirmPw && !pwSaving
                            ? "bg-[#7C74F7] text-white hover:brightness-110"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {pwSaving ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            変更中...
                          </span>
                        ) : (
                          "保存する"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handlePasswordCancel}
                        disabled={pwSaving}
                        className="px-5 py-3 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition-all"
                      >
                        キャンセル
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── ログアウト ─── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        type="button"
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 active:scale-[0.98] transition-all"
      >
        <LogOut size={18} />
        ログアウト
      </motion.button>
    </div>
  );
};

export default ProfileCard;
