import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('tc_user');
    const storedToken = localStorage.getItem('tc_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('tc_user');
        localStorage.removeItem('tc_token');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    localStorage.setItem('tc_token', data.session.access_token);
    localStorage.setItem('tc_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function signup(email, password) {
    const data = await api.signup(email, password);
    if (data.session) {
      localStorage.setItem('tc_token', data.session.access_token);
      localStorage.setItem('tc_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }

  async function logout() {
    await api.logout().catch(() => {});
    localStorage.removeItem('tc_token');
    localStorage.removeItem('tc_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
