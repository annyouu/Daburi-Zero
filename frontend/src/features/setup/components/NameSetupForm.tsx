import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/common/Input";
import { useSetupName } from "../hooks/useSetupName";

export const NameSetupForm = () => {
    const [name, setName] = useState("");
    const { isLoading, error, handleSetupName } = useSetupName();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || isLoading) return;

        const result = await handleSetupName({ name });

        if (result) {
            navigate("/setup/image");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
            <div className="text-center space-y-2">
                {/* ImageSetupFormに合わせた見出しスタイル */}
                <h2 className="text-2xl font-bold text-gray-900">Step 2</h2>
                <p className="text-gray-600">あなたの名前を教えてください</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <Input
                        label="Name"
                        type="text"
                        placeholder="例: たろう"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                        autoFocus 
                        className="rounded-xl"
                    />
                    {error && (
                        <p className="text-sm text-red-500 mt-1 font-medium text-center">{error}</p>
                    )}
                </div>

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={!name || isLoading}
                        className={`
                            w-full py-4 px-4 font-bold rounded-2xl text-lg transition-all shadow-md
                            active:scale-[0.98]
                            ${
                            name && !isLoading
                                ? "bg-[#7C74F7] text-white hover:brightness-110"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }
                        `}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>保存中...</span>
                            </div>
                        ) : (
                            "次へ進む"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="w-full py-2 text-sm text-gray-500 hover:text-[#7C74F7] font-medium transition-colors"
                    >
                        ← アカウント登録に戻る
                    </button>
                </div>
            </form>
        </motion.div>
    );
};