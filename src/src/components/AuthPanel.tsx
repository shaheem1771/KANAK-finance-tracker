import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const defaultForm = { name: '', email: '', password: '' };

export default function AuthPanel() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState(defaultForm);
  const { login, register, loading, error } = useAuth();

  const title = mode === 'login' ? 'Sign in' : 'Create account';
  const submitLabel = mode === 'login' ? 'Login' : 'Register';

  const handleChange = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      toast.success(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully.`);
      setForm(defaultForm);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setForm(defaultForm);
  };

  const showNameField = mode === 'register';

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-slate-400">Use your account to manage your transactions and view live analytics.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {showNameField && (
          <label className="block">
            <span className="text-sm text-slate-400">Name</span>
            <input
              value={form.name}
              onChange={handleChange('name')}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Your full name"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm text-slate-400">Email</span>
          <input
            value={form.email}
            onChange={handleChange('email')}
            type="email"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">Password</span>
          <input
            value={form.password}
            onChange={handleChange('password')}
            type="password"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none focus:border-sky-400"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      <div className="mt-4 text-center text-sm text-slate-500">
        <button type="button" className="font-semibold text-slate-100 underline" onClick={toggleMode}>
          {mode === 'login' ? 'Create a new account' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
}
