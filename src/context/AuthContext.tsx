import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Currency } from '../types';
import { INITIAL_USER_PROFILE } from '../data/demoData';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  completeOnboarding: (data: {
    monthlyIncome: number;
    currency: Currency;
    spendingTarget: number;
    mainGoals: string[];
  }) => void;
  skipOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smartbudget_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return INITIAL_USER_PROFILE; // Default to demo user for easy immediate exploration
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('smartbudget_is_auth');
    return savedAuth !== null ? savedAuth === 'true' : true;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartbudget_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartbudget_user');
    }
    localStorage.setItem('smartbudget_is_auth', String(isAuthenticated));
  }, [user, isAuthenticated]);

  const login = async (email: string, name?: string): Promise<boolean> => {
    // Simulated auth delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUserProfile: UserProfile = {
      ...(user || INITIAL_USER_PROFILE),
      email: email || (user ? user.email : 'user@smartbudget.app'),
      name: name || (user ? user.name : 'Valued User'),
    };
    setUser(newUserProfile);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUserProfile: UserProfile = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      monthlyIncome: 15000,
      spendingTarget: 5000,
      defaultCurrency: 'AED',
      onboardingCompleted: false, // Trigger onboarding flow
      mainGoals: [],
      categories: ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment'],
    };
    setUser(newUserProfile);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const completeOnboarding = (data: {
    monthlyIncome: number;
    currency: Currency;
    spendingTarget: number;
    mainGoals: string[];
  }) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            monthlyIncome: data.monthlyIncome,
            defaultCurrency: data.currency,
            spendingTarget: data.spendingTarget,
            mainGoals: data.mainGoals,
            onboardingCompleted: true,
          }
        : null
    );
  };

  const skipOnboarding = () => {
    setUser((prev) => (prev ? { ...prev, onboardingCompleted: true } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
