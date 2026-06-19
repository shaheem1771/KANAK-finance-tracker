import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-xl shadow-blue-950/50 hover:bg-blue-400 transition-colors"
    >
      <Plus size={20} />
      <span className="hidden sm:inline">New Transaction</span>
    </motion.button>
  );
}
