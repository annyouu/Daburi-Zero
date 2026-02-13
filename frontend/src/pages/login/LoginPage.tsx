import { AnimatePresence } from "framer-motion";
import { LoginForm } from "@/features/login/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#F8F7FF] to-[#EBE9FF] p-4">
      <div className="w-full max-w-110">
        {/* ロゴやアプリ名をページ上部にも置く場合はここに追加 */}
        <AnimatePresence mode="wait">
          <LoginForm />
        </AnimatePresence>
      </div>
      
      {/* フッター的な装飾（任意） */}
      <footer className="mt-8 text-gray-400 text-sm">
        &copy; 2026 だぶりゼロ
      </footer>
    </div>
  );
};

export default LoginPage;