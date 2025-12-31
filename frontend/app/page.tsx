'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/signup");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="text-center space-y-4 relative z-10"
      >
        <h1 className="text-6xl font-extrabold tracking-tighter text-gray-900">
          Destiny Face
        </h1>
        <p className="text-gray-500 text-xl font-medium tracking-wide">
          顔を使ったマッチングサービス
        </p>
      </motion.div>
    </div>
  );
}