import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Target } from 'lucide-react';
import type { Transaction } from '../services/api';

interface InsightsCardProps {
  transactions: Transaction[];
}

export default function InsightsCard({ transactions }: InsightsCardProps) {
  const income = transactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const netSavings = income - expenses;
  const savingsPercentage = income > 0 ? ((netSavings / income) * 100).toFixed(1) : 0;

  const highestExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((max, tx) => (tx.amount > max.amount ? tx : max), { category: 'N/A', amount: 0 });

  const highestIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((max, tx) => (tx.amount > max.amount ? tx : max), { category: 'N/A', amount: 0 });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-emerald-900/30 to-slate-900/50 rounded-3xl border border-emerald-700/30 p-6 shadow-xl shadow-emerald-950/50"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-full bg-emerald-950/50 p-2 text-emerald-400">
          <TrendingUp size={20} />
        </div>
        <h3 className="text-xl font-semibold text-white">Insights</h3>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        <motion.div variants={item} className="rounded-xl bg-slate-800/50 p-3">
          <p className="text-sm text-slate-400">You saved</p>
          <p className="text-lg font-semibold text-emerald-400">₹{netSavings.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">this month ({savingsPercentage}% of income)</p>
        </motion.div>

        <motion.div variants={item} className="rounded-xl bg-slate-800/50 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-sm text-slate-400">Highest expense</p>
          </div>
          <p className="text-lg font-semibold text-red-400">{highestExpense.category}</p>
          <p className="text-sm text-slate-400">₹{highestExpense.amount.toLocaleString('en-IN')}</p>
        </motion.div>

        <motion.div variants={item} className="rounded-xl bg-slate-800/50 p-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-green-400" />
            <p className="text-sm text-slate-400">Highest income</p>
          </div>
          <p className="text-lg font-semibold text-green-400">{highestIncome.category}</p>
          <p className="text-sm text-slate-400">₹{highestIncome.amount.toLocaleString('en-IN')}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
