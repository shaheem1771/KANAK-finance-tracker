import { useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { TrendingUp, TrendingDown, BarChart3, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import OverviewCard from './components/OverviewCard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import RingChart from './components/RingChart';
import AuthPanel from './components/AuthPanel';
import InsightsCard from './components/InsightsCard';
import FloatingActionButton from './components/FloatingActionButton';
import Sidebar from './components/Sidebar';
import useAuth from './hooks/useAuth';
import useTransactions from './hooks/useTransactions';
import type { NewTransaction } from './services/api';

function App() {
  const { user, logout } = useAuth();
  const { transactions, loading, error, addTransaction, fetchTransactions, removeTransaction } = useTransactions(!!user);
  const [formOpen, setFormOpen] = useState(false);
  const [viewType, setViewType] = useState<'expenses' | 'income'>('expenses');
  const [activePage, setActivePage] = useState('dashboard');

  const summary = useMemo(() => {
    const income = transactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    const netSavings = income - expenses;

    return [
      { 
        label: 'Net Savings', 
        value: `₹${Math.abs(netSavings).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
        icon: BarChart3,
        type: 'savings' as const,
        isPositive: netSavings >= 0
      },
      { 
        label: 'Income', 
        value: `₹${income.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
        icon: TrendingUp,
        type: 'income' as const,
        isPositive: true
      },
      { 
        label: 'Expenses', 
        value: `₹${expenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
        icon: TrendingDown,
        type: 'expense' as const,
        isPositive: false
      },
      { 
        label: 'Transactions', 
        value: `${transactions.length}`, 
        icon: BarChart3,
        type: 'transactions' as const
      }
    ];
  }, [transactions]);

  // Chart data removed: we now show only ring chart for income/expenses

  const handleSubmitTransaction = async (transaction: NewTransaction) => {
    try {
      await addTransaction(transaction);
      toast.success('Transaction added');
      setFormOpen(false);
      await fetchTransactions();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await removeTransaction(id);
      toast.success('Transaction deleted');
      await fetchTransactions();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete transaction');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
          <div className="w-full">
            <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-10">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-400/80">kanak</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Track every rupee, master your money</h1>
                <p className="mt-4 max-w-2xl text-slate-400">Sign in or create an account to access the dashboard, add transactions, and view analytics.</p>
              </div>
              <AuthPanel />
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8 md:ml-0">
          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400/80">kanak</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Track every rupee, master your money</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Premium personal finance insights with smart budgeting, transaction analytics, and wealth growth goals.</p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-slate-300 shadow-xl shadow-slate-950/20">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Signed in as</p>
                <p className="mt-1 text-sm font-medium text-white">{user.name}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {summary.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OverviewCard 
                    label={item.label} 
                    value={item.value} 
                    Icon={item.icon}
                    type={item.type as 'income' | 'expense' | 'savings' | 'transactions'}
                    isPositive={item.isPositive}
                  />
                </motion.div>
              ))}
            </div>

            {/* Insights Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InsightsCard transactions={transactions} />
            </motion.div>

            {/* Main Content */}
            <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                  <div className="flex items-center justify-between gap-4 pb-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Category breakdown</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Category Breakdown</h2>
                      <p className="mt-1 text-sm text-slate-400">View Income or Expense category splits</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewType('expenses')}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition ${viewType === 'expenses' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Expenses
                      </button>
                      <button
                        onClick={() => setViewType('income')}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition ${viewType === 'income' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Income
                      </button>
                    </div>
                  </div>
                  <div>
                    <RingChart
                      data={(() => {
                        const map = new Map<string, number>();
                        const wanted = viewType === 'expenses' ? 'expense' : 'income';
                        transactions.forEach((tx) => {
                          if (tx.type !== wanted) return;
                          map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
                        });
                        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
                      })()}
                    />
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                  <div className="flex items-center justify-between gap-4 pb-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Transactions</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Latest moves</h2>
                    </div>
                    <button
                      type="button"
                      onClick={fetchTransactions}
                      className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
                    >
                      Refresh
                    </button>
                  </div>

                  <TransactionTable transactions={transactions} loading={loading} onDelete={handleDeleteTransaction} />
                  {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
                </div>
              </aside>
            </section>

            {/* Transaction Form Modal */}
            {formOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 flex items-end bg-black/50 md:items-center md:justify-center"
                onClick={() => setFormOpen(false)}
              >
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full rounded-t-3xl bg-slate-900 p-6 md:max-w-lg md:rounded-3xl"
                >
                  <TransactionForm onCancel={() => setFormOpen(false)} onSubmit={handleSubmitTransaction} submitting={loading} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setFormOpen(true)} />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
