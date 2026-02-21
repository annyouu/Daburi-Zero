import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import InventoryCard from './InventoryCard';
import type { InventoryItem } from '../types';

// TODO: useInventory() フックに差し替える
const MOCK_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'アタック 抗菌EX',
    category: '洗濯用品',
    imageUrl: '',
    registeredAt: '2025-02-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'メリット シャンプー',
    category: 'ヘアケア',
    imageUrl: '',
    registeredAt: '2025-02-12T14:30:00Z',
  },
  {
    id: '3',
    name: 'キッコーマン 醤油',
    category: '調味料',
    imageUrl: '',
    registeredAt: '2025-02-15T09:00:00Z',
  },
];

const InventoryPreview = () => {
  const items = MOCK_ITEMS;

  return (
    <section className="w-full space-y-3">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-gray-500 tracking-wide">登録中の在庫</h2>
        <Link
          to="/inventory"
          className="text-xs font-medium text-[#7C74F7] hover:opacity-70 transition-opacity"
        >
          すべて見る →
        </Link>
      </div>

      {/* カード一覧 or 空状態 */}
      {items.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
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
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
          <PackageOpen size={32} strokeWidth={1.5} />
          <p className="text-sm">まだ在庫が登録されていません</p>
        </div>
      )}
    </section>
  );
};

export default InventoryPreview;
