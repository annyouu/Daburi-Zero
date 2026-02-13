import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/common/Input";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, handleLogin } = useLogin();

  // ローディング中でなく、かつ入力がある場合に有効化
  const isEnabled = email !== "" && password !== "" && !isLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEnabled) return;

    await handleLogin({ email, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#7C74F7] mb-4">
          だぶりゼロ
        </h1>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-800">おかえりなさい！ログインしましょう</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* バックエンドからのエラーメッセージ表示エリア */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={!isEnabled}
          className={`
            w-full py-4 px-4 font-bold rounded-2xl text-lg transition-all shadow-md
            active:scale-[0.98]
            ${
              isEnabled
                ? "bg-[#7C74F7] text-white hover:brightness-110"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>ログイン中...</span>
            </div>
          ) : (
            "ログインする"
          )}
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/register"
          className="text-sm text-gray-500 hover:text-[#7C74F7] transition-colors font-medium"
        >
          はじめての方はこちら（新規登録）
        </Link>
      </div>
    </motion.div>
  );
};