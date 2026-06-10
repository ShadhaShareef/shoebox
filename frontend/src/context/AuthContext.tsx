import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchAccount, login as apiLogin, logout as apiLogout, register as apiRegister } from '../lib/api';
import type { UserProfile } from '../types';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { firstName: string; lastName: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfileToUser = (profile: UserProfile): User => ({
  id: profile.id,
  first_name: profile.firstName,
  last_name: profile.lastName,
  email: profile.email,
  phone: profile.phone || undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const account = await fetchAccount();
      setUser(mapProfileToUser(account.user));
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiLogin({ email, password });
      setUser(mapProfileToUser(response.user));
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { firstName: string; lastName: string; email: string; phone?: string; password: string }) => {
    setLoading(true);
    try {
      const response = await apiRegister(payload);
      setUser(mapProfileToUser(response.user));
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
