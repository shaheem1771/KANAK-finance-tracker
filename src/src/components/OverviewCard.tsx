import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewCardProps {
  label: string;
  value: string;
  Icon: LucideIcon;
  type?: 'income' | 'expense' | 'savings' | 'transactions';
  amount?: number;
  isPositive?: boolean;
}

export default function OverviewCard({ label, value, Icon, type = 'savings', amount, isPositive }: OverviewCardProps) {
  const colorMap = {
    income: { bg: 'from-green-900/30 to-slate-900/50', border: 'border-green-700/30', icon: 'text-green-400', glow: 'shadow-green-950/50' },
    expense: { bg: 'from-red-900/30 to-slate-900/50', border: 'border-red-700/30', icon: 'text-red-400', glow: 'shadow-red-950/50' },
    savings: { bg: 'from-blue-900/30 to-slate-900/50', border: 'border-blue-700/30', icon: 'text-blue-400', glow: 'shadow-blue-950/50' },
    transactions: { bg: 'from-purple-900/30 to-slate-900/50', border: 'border-purple-700/30', icon: 'text-purple-400', glow: 'shadow-purple-950/50' }
  };

  const colors = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colors.bg} rounded-3xl border ${colors.border} p-6 shadow-xl ${colors.glow}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{label}</p>
          <p className={`mt-2 text-3xl font-semibold ${isPositive !== undefined ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
            {isPositive === true && '+'}
            {isPositive === false && '-'}
            {value}
          </p>
          {amount && (
            <p className="mt-1 text-xs text-slate-400">
              {type === 'income' && 'Income'}
              {type === 'expense' && 'Expenses'}
              {type === 'savings' && 'Income − Expenses'}
              {type === 'transactions' && 'Total'}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`rounded-2xl bg-slate-950/50 p-3 ${colors.icon} shadow-inner shadow-slate-950/20`}
        >
          <Icon size={28} />
        </motion.div>
      </div>
    </motion.div>
  );
}
