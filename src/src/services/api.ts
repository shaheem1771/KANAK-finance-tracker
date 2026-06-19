export interface UserProfile {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewTransaction {
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
}

const API_BASE = '/api';

async function apiFetch<T>(endpoint: string, init: RequestInit = {}) {
  const token = localStorage.getItem('kanank_token');
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...init,
    headers,
    credentials: 'same-origin'
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload?.message || 'Network response was not ok');
  }

  return payload as T;
}

export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function getTransactions() {
  return apiFetch<Transaction[]>('/transactions');
}

export async function createTransaction(transaction: NewTransaction) {
  return apiFetch<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction)
  });
}

export async function deleteTransaction(id: string) {
  return apiFetch<{ success: boolean }>(`/transactions/${id}`, {
    method: 'DELETE'
  });
}
