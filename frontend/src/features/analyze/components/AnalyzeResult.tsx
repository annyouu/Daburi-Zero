import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Plus } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Verdict = "match" | "similar" | "none";

interface AnalyzeRouteState {
  previewUrl: string;
}

// ── Verdict config ─────────────────────────────────────────────────────────

const getVerdict = (score: number): Verdict => {
  if (score >= 90) return "match";
  if (score >= 70) return "similar";
  return "none";
};

const VERDICT_CONFIG = {
  match: {
    Icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    headline: "家にある商品です！",
    sub: "この商品はすでに在庫に登録されています。",
  },
  similar: {
    Icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    headline: "似たものがあります",
    sub: "登録済みの商品と似ています。在庫を確認してみましょう。",
  },
  none: {
    Icon: XCircle,
    color: "text-gray-400",
    bg: "bg-gray-50",
    border: "border-gray-200",
    headline: "持っていないようです",
    sub: "この商品はまだ在庫に登録されていません。",
  },
} as const;

// ── Loading view ───────────────────────────────────────────────────────────

const LoadingView = ({ previewUrl }: { previewUrl: string }) => (
  <motion.div
    key="loading"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    className="space-y-5"
  >
    <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="relative w-full aspect-4/3">
        <img src={previewUrl} alt="解析中の画像" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        {/* スキャンライン */}
        <motion.div
          className="absolute inset-x-0 h-0.5 bg-[#7C74F7]"
          style={{ boxShadow: "0 0 14px 5px rgba(124, 116, 247, 0.55)" }}
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-4 border-[#7C74F7] border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-bold text-base">AIが解析中...</p>
          <p className="text-white/60 text-xs">在庫データと照合しています</p>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-100 rounded-full animate-pulse w-2/3" />
        <div className="h-4 bg-gray-100 rounded-full animate-pulse w-5/12" />
      </div>
    </div>
    <div className="h-20 bg-white rounded-2xl shadow border border-gray-100 animate-pulse" />
    <div className="h-12 bg-white rounded-2xl shadow border border-gray-100 animate-pulse opacity-50" />
  </motion.div>
);

// ── Result view ────────────────────────────────────────────────────────────

type ResultViewProps = {
  previewUrl: string;
  score: number;
  verdict: Verdict;
  onNavigateToRegister: () => void;
  onGoHome: () => void;
};

const ResultView = ({
  previewUrl,
  score,
  verdict,
  onNavigateToRegister,
  onGoHome,
}: ResultViewProps) => {
  const { Icon, color, bg, border, headline, sub } = VERDICT_CONFIG[verdict];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="space-y-5"
    >
      <div className="w-full p-7 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center gap-5">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.08 }}
        >
          <Icon size={64} className={color} strokeWidth={1.5} />
        </motion.div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">{headline}</h2>
          <p className="text-gray-500 text-sm">{sub}</p>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-bold ${bg} ${color} ${border}`}>
          <span>類似度</span>
          <span className="text-lg font-extrabold">{score}%</span>
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <img src={previewUrl} alt="撮影した商品" className="w-full object-cover max-h-60" />
      </div>

      <AnimatePresence>
        {verdict === "none" && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onNavigateToRegister}
            className="w-full flex items-center justify-center gap-2 py-4 font-bold rounded-2xl text-lg bg-[#7C74F7] text-white hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
          >
            <Plus size={20} />
            新しい商品として登録する
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verdict === "similar" && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onGoHome}
            className="w-full py-4 font-bold rounded-2xl text-base border-2 border-[#7C74F7] text-[#7C74F7] hover:bg-[#EBE9FF] active:scale-[0.98] transition-all"
          >
            在庫一覧で確認する
          </motion.button>
        )}
      </AnimatePresence>

      <button
        onClick={onGoHome}
        className="w-full py-3 text-sm text-gray-400 hover:text-[#7C74F7] font-medium transition-colors"
      >
        ホームに戻る
      </button>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────

const AnalyzeResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as AnalyzeRouteState | null;

  const [phase, setPhase] = useState<"loading" | "result">("loading");
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!state?.previewUrl) {
      navigate("/home", { replace: true });
      return;
    }

    // フェイクローディング: 3秒後にモックスコアを決定
    // TODO: 実際のAPIレスポンスに差し替える
    const timer = setTimeout(() => {
      const mockScore = Math.random() < 0.5 ? 92 : 40;
      setScore(mockScore);
      setPhase("result");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!state?.previewUrl) return null;

  const verdict = getVerdict(score);

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#7C74F7] font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        ホームに戻る
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900">照合結果</h1>
        <p className="text-gray-500 text-sm mt-0.5">撮影した商品の在庫確認</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <LoadingView previewUrl={state.previewUrl} />
        ) : (
          <ResultView
            previewUrl={state.previewUrl}
            score={score}
            verdict={verdict}
            onNavigateToRegister={() =>
              navigate("/inventory/register", {
                state: { previewUrl: state.previewUrl },
              })
            }
            onGoHome={() => navigate("/home")}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzeResult;
