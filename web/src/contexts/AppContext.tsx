import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo } from '../types';

interface AppContextType {
  // Authentication state
  isAuthenticated: boolean;
  authToken: string | null;
  
  // User state
  currentUser: UserInfo | null;
  setCurrentUser: (user: UserInfo | null) => void;
  
  // User management functions (reduced; no fetching all users)
  clearUser: () => void;
  
  // Authentication functions
  login: (token: string, user?: UserInfo) => void;
  logout: () => void;
  
  // App state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Authentication state
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // User state
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  
  // App state
  const [isLoading, setIsLoading] = useState(false);

  // Clear current user selection
  const clearUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Authentication functions
  const login = (token: string, user?: UserInfo) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  // Restore authentication state and current user on mount
  useEffect(() => {
    const initializeApp = async () => {
      // Check for existing auth token
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        setAuthToken(savedToken);
        setIsAuthenticated(true);
      }

      const savedUserJson = localStorage.getItem('currentUser');
      if (savedUserJson) {
        try {
          const savedUser = JSON.parse(savedUserJson) as UserInfo;
          setCurrentUser(savedUser);
        } catch {}
      }
    };

    initializeApp();
  }, []);

  const contextValue: AppContextType = {
    // Authentication state
    isAuthenticated,
    authToken,
    
    // User state
    currentUser,
    setCurrentUser,
    
    // User management functions
    clearUser,
    
    // Authentication functions
    login,
    logout,
    
    // App state
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
