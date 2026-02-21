import { Link } from 'react-router-dom';
import { Package, Menu, X } from 'lucide-react';

type Props = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const Header = ({ sidebarOpen, onToggleSidebar }: Props) => {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0 z-10">
      {/* サイドバートグルボタン（デスクトップのみ） */}
      <button
        onClick={onToggleSidebar}
        className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label={sidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <Link
        to="/home"
        className="flex items-center gap-2 text-[#7C74F7] font-bold text-lg select-none"
      >
        <Package size={24} strokeWidth={2} />
        <span>だぶりゼロ</span>
      </Link>
    </header>
  );
};

export default Header;
