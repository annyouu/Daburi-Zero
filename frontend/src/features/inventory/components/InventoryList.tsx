import { Link } from "react-router-dom";
import { Plus, PackageOpen } from "lucide-react";
import { motion } from "framer-motion";
import InventoryCard from "./InventoryCard";
import type { InventoryItem } from "@/features/inventory/types";

// TODO: useInventory() フックに差し替える
const MOCK_ITEMS: InventoryItem[] = [
  {
    id: "1",
    name: "アタック 抗菌EX",
    category: "洗濯用品",
    imageUrl: "",
    registeredAt: "2025-02-10T10:00:00Z",
  },
  {
    id: "2",
    name: "メリット シャンプー",
    category: "ヘアケア",
    imageUrl: "",
    registeredAt: "2025-02-12T14:30:00Z",
  },
  {
    id: "3",
    name: "キッコーマン 醤油",
    category: "調味料",
    imageUrl: "",
    registeredAt: "2025-02-15T09:00:00Z",
  },
];

const InventoryList = () => {
  const items = MOCK_ITEMS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl font-bold text-gray-900">在庫一覧</h1>
        <Link
          to="/inventory/register"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7C74F7] text-white text-sm font-semibold hover:brightness-110 active:scale-[0.97] transition-all shadow-sm"
        >
          <Plus size={16} />
          登録する
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <InventoryCard item={item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
          <PackageOpen size={40} strokeWidth={1.5} />
          <p className="text-sm">まだ在庫が登録されていません</p>
          <Link
            to="/inventory/register"
            className="mt-2 px-6 py-3 rounded-2xl bg-[#7C74F7] text-white text-sm font-bold hover:brightness-110 transition-all shadow-md"
          >
            最初の在庫を登録する
          </Link>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
