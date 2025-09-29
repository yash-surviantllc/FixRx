import { create } from 'zustand';
import type { Vendor, Contact, Invitation, Rating, Connection } from '../types/api';

interface AppState {
  // Navigation state
  currentScreen: string;
  activeTab: string;
  
  // Data state
  vendors: Vendor[];
  contacts: Contact[];
  invitations: Invitation[];
  ratings: Rating[];
  connections: Connection[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedVendor: Vendor | null;
  selectedContacts: Contact[];
  
  // Location state
  userLocation: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  } | null;
  
  // Actions
  setCurrentScreen: (screen: string) => void;
  setActiveTab: (tab: string) => void;
  setVendors: (vendors: Vendor[]) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  removeContact: (contactId: string) => void;
  setInvitations: (invitations: Invitation[]) => void;
  addInvitation: (invitation: Invitation) => void;
  updateInvitation: (invitationId: string, updates: Partial<Invitation>) => void;
  setRatings: (ratings: Rating[]) => void;
  addRating: (rating: Rating) => void;
  updateRating: (ratingId: string, updates: Partial<Rating>) => void;
  setConnections: (connections: Connection[]) => void;
  addConnection: (connection: Connection) => void;
  updateConnection: (connectionId: string, updates: Partial<Connection>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedVendor: (vendor: Vendor | null) => void;
  setSelectedContacts: (contacts: Contact[]) => void;
  addSelectedContact: (contact: Contact) => void;
  removeSelectedContact: (contactId: string) => void;
  clearSelectedContacts: () => void;
  setUserLocation: (location: AppState['userLocation']) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentScreen: 'welcome',
  activeTab: 'home',
  vendors: [],
  contacts: [],
  invitations: [],
  ratings: [],
  connections: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedVendor: null,
  selectedContacts: [],
  userLocation: null,

  // Navigation actions
  setCurrentScreen: (screen: string) => set({ currentScreen: screen }),
  setActiveTab: (tab: string) => set({ activeTab: tab }),

  // Vendor actions
  setVendors: (vendors: Vendor[]) => set({ vendors }),
  addVendor: (vendor: Vendor) => set((state) => ({ 
    vendors: [...state.vendors, vendor] 
  })),
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => set((state) => ({
    vendors: state.vendors.map(vendor => 
      vendor.id === vendorId ? { ...vendor, ...updates } : vendor
    )
  })),

  // Contact actions
  setContacts: (contacts: Contact[]) => set({ contacts }),
  addContact: (contact: Contact) => set((state) => ({ 
    contacts: [...state.contacts, contact] 
  })),
  updateContact: (contactId: string, updates: Partial<Contact>) => set((state) => ({
    contacts: state.contacts.map(contact => 
      contact.id === contactId ? { ...contact, ...updates } : contact
    )
  })),
  removeContact: (contactId: string) => set((state) => ({
    contacts: state.contacts.filter(contact => contact.id !== contactId)
  })),

  // Invitation actions
  setInvitations: (invitations: Invitation[]) => set({ invitations }),
  addInvitation: (invitation: Invitation) => set((state) => ({ 
    invitations: [...state.invitations, invitation] 
  })),
  updateInvitation: (invitationId: string, updates: Partial<Invitation>) => set((state) => ({
    invitations: state.invitations.map(invitation => 
      invitation.id === invitationId ? { ...invitation, ...updates } : invitation
    )
  })),

  // Rating actions
  setRatings: (ratings: Rating[]) => set({ ratings }),
  addRating: (rating: Rating) => set((state) => ({ 
    ratings: [...state.ratings, rating] 
  })),
  updateRating: (ratingId: string, updates: Partial<Rating>) => set((state) => ({
    ratings: state.ratings.map(rating => 
      rating.id === ratingId ? { ...rating, ...updates } : rating
    )
  })),

  // Connection actions
  setConnections: (connections: Connection[]) => set({ connections }),
  addConnection: (connection: Connection) => set((state) => ({ 
    connections: [...state.connections, connection] 
  })),
  updateConnection: (connectionId: string, updates: Partial<Connection>) => set((state) => ({
    connections: state.connections.map(connection => 
      connection.id === connectionId ? { ...connection, ...updates } : connection
    )
  })),

  // UI actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // Selection actions
  setSelectedVendor: (vendor: Vendor | null) => set({ selectedVendor: vendor }),
  setSelectedContacts: (contacts: Contact[]) => set({ selectedContacts: contacts }),
  addSelectedContact: (contact: Contact) => set((state) => {
    const isAlreadySelected = state.selectedContacts.some(c => c.id === contact.id);
    if (isAlreadySelected) return state;
    return { selectedContacts: [...state.selectedContacts, contact] };
  }),
  removeSelectedContact: (contactId: string) => set((state) => ({
    selectedContacts: state.selectedContacts.filter(contact => contact.id !== contactId)
  })),
  clearSelectedContacts: () => set({ selectedContacts: [] }),

  // Location actions
  setUserLocation: (location: AppState['userLocation']) => set({ userLocation: location }),

  // Reset action
  reset: () => set({
    vendors: [],
    contacts: [],
    invitations: [],
    ratings: [],
    connections: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedVendor: null,
    selectedContacts: [],
    userLocation: null,
  }),
}));

export default useAppStore;
