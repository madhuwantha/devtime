import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo } from '../types';
import { userApi } from '../services/api';

interface AppContextType {
  // User state
  currentUser: UserInfo | null;
  setCurrentUser: (user: UserInfo | null) => void;
  users: UserInfo[];
  setUsers: (users: UserInfo[]) => void;
  loadingUsers: boolean;
  setLoadingUsers: (loading: boolean) => void;
  
  // User management functions
  fetchUsers: () => Promise<void>;
  selectUser: (userId: string) => void;
  clearUser: () => void;
  
  // App state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User state
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // App state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users from API
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const userList = await userApi.getAllUsers();
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Select a user by ID
  const selectUser = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      // Store selected user in localStorage for persistence
      localStorage.setItem('selectedUserId', userId);
    }
  };

  // Clear current user selection
  const clearUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('selectedUserId');
  };

  // Load users and restore selected user on mount
  useEffect(() => {
    const initializeApp = async () => {
      await fetchUsers();
      
      // Restore previously selected user
      const savedUserId = localStorage.getItem('selectedUserId');
      if (savedUserId) {
        // Wait a bit for users to be loaded, then select the saved user
        setTimeout(() => {
          selectUser(savedUserId);
        }, 100);
      }
    };

    initializeApp();
  }, []);

  // Update current user when users list changes (in case the selected user was updated)
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const updatedUser = users.find(u => u._id === currentUser._id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser]);

  const contextValue: AppContextType = {
    // User state
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    loadingUsers,
    setLoadingUsers,
    
    // User management functions
    fetchUsers,
    selectUser,
    clearUser,
    
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
