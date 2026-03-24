import { createContext, useContext, useState, type ReactNode } from 'react';

// ─── Types 

export interface TradingSession {
  token: string;
  appId: string;
  investmentId: string;
  investmentReference: string;
  poolName: string;
  investmentAmount: number;
}

interface TradingContextValue {
  session: TradingSession | null;
  openSession: (session: TradingSession) => void;
  clearSession: () => void;
}

const SESSION_KEY = 'deriv_trading_session';

// ─── Context

const TradingContext = createContext<TradingContextValue | null>(null);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  // Initialise from sessionStorage so the token survives a navigate() remount
  const [session, setSession] = useState<TradingSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as TradingSession) : null;
    } catch {
      return null;
    }
  });

  const openSession = (s: TradingSession) => {
    // Write to sessionStorage first, then update state
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  };

  const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <TradingContext.Provider value={{ session, openSession, clearSession }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingSession = (): TradingContextValue => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTradingSession must be used within TradingProvider');
  return ctx;
};