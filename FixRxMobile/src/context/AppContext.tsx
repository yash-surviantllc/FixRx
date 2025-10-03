import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserType } from '../types/navigation';

interface AppContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  selectedContacts: any[];
  setSelectedContacts: (contacts: any[]) => void;
  invitationType: 'contractors' | 'friends' | null;
  setInvitationType: (type: 'contractors' | 'friends' | null) => void;
  hasContactedContractor: boolean;
  setHasContactedContractor: (value: boolean) => void;
  notificationPermissionGranted: boolean;
  setNotificationPermissionGranted: (value: boolean) => void;
  selectedRequestId: string;
  setSelectedRequestId: (id: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState<UserType>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [invitationType, setInvitationType] = useState<'contractors' | 'friends' | null>(null);
  const [hasContactedContractor, setHasContactedContractor] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for testing

  const logout = () => {
    setUserEmail('');
    setUserType(null);
    setUserProfile(null);
    setSelectedContacts([]);
    setInvitationType(null);
    setHasContactedContractor(false);
    setNotificationPermissionGranted(false);
    setSelectedRequestId('');
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        userEmail,
        setUserEmail,
        userType,
        setUserType,
        userProfile,
        setUserProfile,
        selectedContacts,
        setSelectedContacts,
        invitationType,
        setInvitationType,
        hasContactedContractor,
        setHasContactedContractor,
        notificationPermissionGranted,
        setNotificationPermissionGranted,
        selectedRequestId,
        setSelectedRequestId,
        logout,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
