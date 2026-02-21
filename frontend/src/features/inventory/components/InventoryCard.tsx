import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import type { InventoryItem } from '../types';

type Props = {
  item: InventoryItem;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

const InventoryCard = ({ item }: Props) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="w-36 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
    >
      {/* 画像 */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff size={28} className="text-gray-300" />
        )}
      </div>

      {/* テキスト情報 */}
      <div className="p-2.5 space-y-1.5">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EBE9FF] text-[#7C74F7]">
          {item.category}
        </span>
        <p className="text-[10px] text-gray-400">{formatDate(item.registeredAt)}</p>
      </div>
    </motion.div>
  );
};

export default InventoryCard;
