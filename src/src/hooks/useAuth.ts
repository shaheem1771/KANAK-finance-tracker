import { useCallback, useEffect, useState } from 'react';
import type { UserProfile } from '../services/api';
import { login as loginRequest, register as registerRequest } from '../services/api';

const STORAGE_KEY = 'kanank_user';
const AUTH_EVENT = 'kanank_auth_updated';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

function getStoredSession() {
  const token = localStorage.getItem('kanank_token');
  const userJson = localStorage.getItem(STORAGE_KEY);
  if (!token || !userJson) return null;

  try {
    return { user: JSON.parse(userJson) as UserProfile, token };
  } catch {
    return null;
  }
}

function broadcastAuthUpdate() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

export default function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const stored = getStoredSession();
    if (stored) {
      setState({ user: stored.user, token: stored.token, loading: false, error: null });
    }

    const handleAuthUpdate = () => {
      const updated = getStoredSession();
      if (updated) {
        setState({ user: updated.user, token: updated.token, loading: false, error: null });
      } else {
        setState(initialState);
      }
    };

    window.addEventListener(AUTH_EVENT, handleAuthUpdate);
    return () => window.removeEventListener(AUTH_EVENT, handleAuthUpdate);
  }, []);

  const saveSession = useCallback((user: UserProfile, token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem('kanank_token', token);
    setState({ user, token, loading: false, error: null });
    broadcastAuthUpdate();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('kanank_token');
    setState(initialState);
    broadcastAuthUpdate();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await loginRequest(email, password);
      saveSession(response.user, response.token);
      return response.user;
    } catch (err) {
      const message = (err as Error).message || 'Login failed';
      setState({ user: null, token: null, loading: false, error: message });
      throw new Error(message);
    }
  }, [saveSession]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await registerRequest(name, email, password);
      saveSession(response.user, response.token);
      return response.user;
    } catch (err) {
      const message = (err as Error).message || 'Registration failed';
      setState({ user: null, token: null, loading: false, error: message });
      throw new Error(message);
    }
  }, [saveSession]);

  return {
    ...state,
    login,
    register,
    logout
  };
}
