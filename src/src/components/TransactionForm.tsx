import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import type { NewTransaction } from '../services/api';

interface TransactionFormProps {
  onSubmit: (transaction: NewTransaction) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

type LocalForm = {
  date: string;
  category: string;
  amount: string; // keep as string so user can delete content
  type: 'income' | 'expense';
  note?: string;
};

const initialLocal: LocalForm = {
  date: new Date().toISOString().slice(0, 10),
  category: '',
  amount: '',
  type: 'expense',
  note: ''
};

export default function TransactionForm({ onSubmit, onCancel, submitting }: TransactionFormProps) {
  const [form, setForm] = useState<LocalForm>(initialLocal);

  const handleChange = (field: keyof LocalForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = form.amount === '' ? 0 : Number(form.amount);
    const payload: NewTransaction = {
      date: form.date,
      category: form.category.trim(),
      amount,
      type: form.type,
      note: form.note?.trim() || ''
    };

    await onSubmit(payload);
    setForm(initialLocal);
  };

  return (
    <form className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-400">Date</span>
          <input
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-400">Category</span>
          <input
            value={form.category}
            onChange={handleChange('category')}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="Groceries"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-400">Amount</span>
          <input
            type="number"
            value={form.amount}
            onChange={handleChange('amount')}
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="0.00"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-400">Type</span>
          <select
            value={form.type}
            onChange={handleChange('type')}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-sky-400"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-400">Note</span>
        <input
          value={form.note}
          onChange={handleChange('note')}
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-sky-400"
          placeholder="Optional notes"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add transaction
        </button>
      </div>
    </form>
  );
}
