import { NavLink } from 'react-router-dom';
import { Home, Camera, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/home', icon: Home, label: 'ホーム' },
  { to: '/inventory', icon: Camera, label: '在庫登録' },
  { to: '/profile', icon: User, label: 'プロフィール' },
];

type Props = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: Props) => {
  return (
    <>
      {/* Desktop: 左サイドバー（アニメーション付き） */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 224, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden md:flex flex-col bg-white border-r border-gray-100 py-6 shrink-0 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-3 w-56">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to}>
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#EBE9FF] text-[#7C74F7]'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="whitespace-nowrap">{label}</span>
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile: 下部ナビゲーション（常時表示） */}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 z-20">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="flex-1">
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-0.5 py-2 transition-colors ${
                  isActive ? 'text-[#7C74F7]' : 'text-gray-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
