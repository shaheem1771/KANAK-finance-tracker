import type { Transaction } from '../services/api';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export default function TransactionTable({ transactions, loading, onDelete }: TransactionTableProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40">
      <table className="w-full min-w-full border-collapse text-left text-sm text-slate-300">
        <thead className="bg-slate-900/70 text-slate-400">
          <tr>
            <th className="px-4 py-4 font-semibold">Date</th>
            <th className="px-4 py-4 font-semibold">Category</th>
            <th className="px-4 py-4 font-semibold">Amount</th>
            <th className="px-4 py-4 font-semibold">Type</th>
            <th className="px-4 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                Loading transactions...
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                No transactions yet. Add one to get started.
              </td>
            </tr>
          ) : (
            <motion.tbody variants={container} initial="hidden" animate="show" className="contents">
              {transactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  variants={item}
                  whileHover={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}
                  className="border-t border-slate-800/50 transition"
                >
                  <td className="px-4 py-4">{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-4 font-medium">{transaction.category}</td>
                  <td className={`px-4 py-4 font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-green-900/40 text-green-300 border border-green-700/40'
                          : 'bg-red-900/40 text-red-300 border border-red-700/40'
                      }`}
                    >
                      {transaction.type === 'income' ? '↑ Income' : '↓ Expense'}
                    </motion.span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {onDelete && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          if (!confirm('Delete this transaction?')) return;
                          try {
                            await onDelete(transaction.id);
                          } catch (err) {
                            // swallow; hook will set error
                          }
                        }}
                        title="Delete"
                        className="inline-flex items-center gap-1 rounded-full bg-rose-600/20 px-3 py-1 text-xs font-medium text-rose-300 hover:bg-rose-600/40 transition border border-rose-700/30"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          )}
        </tbody>
      </table>
    </div>
  );
}
