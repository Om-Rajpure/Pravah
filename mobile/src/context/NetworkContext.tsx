import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkContextType {
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  lastUpdated: string;
  setLastUpdated: (time: string) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  return (
    <NetworkContext.Provider
      value={{
        isOffline,
        setIsOffline,
        lastUpdated,
        setLastUpdated,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
