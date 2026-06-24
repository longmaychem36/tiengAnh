// ============================================
// Auth Context - Global Authentication State
// ============================================
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../api/authApi';
import { stopAllPlayback } from '../utils/audioControl';

export const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'user:v1';
const LEGACY_USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem(LEGACY_USER_STORAGE_KEY);
    if (saved && !localStorage.getItem(USER_STORAGE_KEY)) {
      localStorage.setItem(USER_STORAGE_KEY, saved);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    }
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      authApi.getMe()
        .then(res => {
          setUser(res.data);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
        })
        .catch(() => {
          stopAllPlayback();
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    const { user: userData, token } = res.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    const { user: userData, token } = res.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    stopAllPlayback();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, updateUser }), [
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
