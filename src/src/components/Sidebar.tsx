import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, TrendingDown, Grid3X3, Target, BarChart3, Zap, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: BarChart3 },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'categories', label: 'Categories', icon: Grid3X3 },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05 }
    })
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 md:hidden rounded-full bg-blue-500 p-2 text-white"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={isOpen ? 'show' : 'hidden'}
        animate={isOpen ? 'show' : 'hidden'}
        className="fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 backdrop-blur md:sticky md:top-0 md:z-10 md:translate-x-0"
      >
        <div className="p-6 pt-20 md:pt-6">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest text-blue-400 font-semibold">KANAK</p>
            <p className="mt-1 text-xs text-slate-400">Track every rupee</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <motion.button
                  key={item.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto h-2 w-2 rounded-full bg-blue-400"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}
    </>
  );
}
