import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getLocalSession,
  setLocalSession,
  clearLocalSession,
  registerLocalUser,
  loginLocalUser,
  ensureLocalAdmin,
  updateLocalUserName,
} from '../lib/localUsers';

interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: LocalUser | null;
  session: LocalUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfileName: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    ensureLocalAdmin('vm0529615@gmail.com', 'vanaveter');
    const localSession = getLocalSession();
    setSession(localSession);
    setUser(localSession ?? null);
    setIsAdminUser(localSession?.isAdmin ?? false);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const result = registerLocalUser(email, password);
    if (!result.success) {
      return { error: new Error(result.error || 'Registration failed') };
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const result = loginLocalUser(email, password);
    if (!result.success) {
      return { error: new Error(result.error || 'Invalid credentials') };
    }
    setSession(result.user ?? null);
    setUser(result.user ?? null);
    setIsAdminUser(result.user?.isAdmin ?? false);
    return { error: null };
  };

  const updateProfileName = async (name: string): Promise<boolean> => {
    if (!user) return false;
    const result = updateLocalUserName(user.id, name);
    if (!result.success) return false;
    const updatedUser = { ...user, name };
    setUser(updatedUser);
    setSession(updatedUser);
    setLocalSession(updatedUser);
    return true;
  };

  const signOut = async () => {
    clearLocalSession();
    setUser(null);
    setSession(null);
    setIsAdminUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin: isAdminUser, signUp, signIn, signOut, updateProfileName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
