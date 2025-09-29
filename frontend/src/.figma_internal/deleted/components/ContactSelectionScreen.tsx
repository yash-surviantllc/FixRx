import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Mic, 
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  User,
  Phone,
  Clock,
  Heart,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactSelectionScreenProps {
  onBack: () => void;
  onContactsSelected: (contacts: Contact[]) => void;
  vendorName?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isLikelyContractor: boolean;
  completionScore: 'complete' | 'missing' | 'invalid';
  lastContact?: string;
  isFavorite?: boolean;
  businessInfo?: string;
}

// Mock contact data with AI contractor detection
const generateMockContacts = (): Contact[] => {
  const contractorNames = [
    'Mike Rodriguez Plumbing',
    'Sarah\'s Electric Service',
    'Dave Wilson Construction',
    'Elite Roofing Co',
    'Quick Fix Handyman',
    'Martinez HVAC',
    'Johnson Flooring',
    'Premium Painting LLC',
    'Green Thumb Landscaping',
    'Clean Pro Services'
  ];

  const regularNames = [
    'John Smith',
    'Emily Johnson',
    'Michael Brown',
    'Jessica Davis',
    'David Miller',
    'Ashley Wilson',
    'Christopher Moore',
    'Amanda Taylor',
    'Matthew Anderson',
    'Stephanie Thomas',
    'Andrew Jackson',
    'Michelle White',
    'James Harris',
    'Lisa Martin',
    'Robert Thompson',
    'Jennifer Garcia',
    'William Martinez',
    'Elizabeth Robinson',
    'Daniel Clark',
    'Mary Rodriguez'
  ];

  const allContacts: Contact[] = [];

  // Add contractor contacts
  contractorNames.forEach((name, index) => {
    allContacts.push({
      id: `contractor-${index}`,
      name: name,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      isLikelyContractor: true,
      completionScore: Math.random() > 0.8 ? 'missing' : 'complete',
      lastContact: Math.random() > 0.5 ? `${Math.floor(Math.random() * 30) + 1} days ago` : undefined,
      isFavorite: Math.random() > 0.8,
      businessInfo: 'Professional service provider'
    });
  });

  // Add regular contacts
  regularNames.forEach((name, index) => {
    allContacts.push({
      id: `regular-${index}`,
      name: name,
      phone: Math.random() > 0.1 ? `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : '',
      isLikelyContractor: false,
      completionScore: Math.random() > 0.9 ? 'missing' : Math.random() > 0.95 ? 'invalid' : 'complete',
      lastContact: Math.random() > 0.3 ? `${Math.floor(Math.random() * 90) + 1} days ago` : undefined,
      isFavorite: Math.random() > 0.9
    });
  });

  return allContacts.sort((a, b) => a.name.localeCompare(b.name));
};

export function ContactSelectionScreen({ 
  onBack, 
  onContactsSelected, 
  vendorName = 'Mike' 
}: ContactSelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'favorites' | 'contractors'>('all');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [showSelectedPreview, setShowSelectedPreview] = useState(false);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  
  const allContacts = useMemo(() => generateMockContacts(), []);
  
  const filteredContacts = useMemo(() => {
    let filtered = allContacts;
    
    // Apply filter
    switch (selectedFilter) {
      case 'recent':
        filtered = filtered.filter(contact => contact.lastContact);
        break;
      case 'favorites':
        filtered = filtered.filter(contact => contact.isFavorite);
        break;
      case 'contractors':
        filtered = filtered.filter(contact => contact.isLikelyContractor);
        break;
    }
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      );
    }
    
    return filtered;
  }, [allContacts, selectedFilter, searchQuery]);

  const contractorCount = allContacts.filter(c => c.isLikelyContractor).length;
  const selectedContactsData = allContacts.filter(c => selectedContacts.has(c.id));

  const handleContactToggle = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleSelectAllVisible = () => {
    const newSelected = new Set(selectedContacts);
    filteredContacts.forEach(contact => {
      newSelected.add(contact.id);
    });
    setSelectedContacts(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedContacts(new Set());
  };

  const handleVoiceSearch = () => {
    setIsVoiceSearchActive(true);
    // Simulate voice search
    setTimeout(() => {
      setIsVoiceSearchActive(false);
      setSearchQuery('plumbing');
    }, 2000);
  };

  const getCompletionIcon = (score: 'complete' | 'missing' | 'invalid') => {
    switch (score) {
      case 'complete':
        return <CheckCircle2 size={16} color="#34C759" />;
      case 'missing':
        return <AlertTriangle size={16} color="#FF9500" />;
      case 'invalid':
        return <AlertCircle size={16} color="#FF3B30" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const ContactItem = ({ contact }: { contact: Contact }) => {
    const isSelected = selectedContacts.has(contact.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`h-20 px-5 flex items-center justify-between border-b border-gray-100 transition-all duration-200 ${
          isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => handleContactToggle(contact.id)}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: isSelected ? '#007AFF' : '#F3F4F6' }}
            >
              {contact.avatar ? (
                <img 
                  src={contact.avatar} 
                  alt={contact.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span 
                  className="text-[14px] font-medium"
                  style={{ 
                    color: isSelected ? 'white' : '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {getInitials(contact.name)}
                </span>
              )}
            </div>
            
            {/* Quality indicator */}
            <div className="absolute -bottom-1 -right-1">
              {getCompletionIcon(contact.completionScore)}
            </div>
            
            {/* Favorite indicator */}
            {contact.isFavorite && (
              <div className="absolute -top-1 -left-1">
                <Heart size={12} color="#FF3B30" fill="#FF3B30" />
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 
                className="text-[16px] font-medium truncate"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {contact.name}
              </h3>
              
              {contact.isLikelyContractor && (
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ 
                    backgroundColor: '#E8F2FF',
                    color: '#007AFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Likely contractor
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <span 
                className="text-[14px] truncate"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {contact.phone || 'No phone number'}
              </span>
              
              {contact.lastContact && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} color="#6B7280" />
                    <span 
                      className="text-[12px]"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {contact.lastContact}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="ml-3">
          <div 
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-white border-gray-300'
            }`}
          >
            {isSelected && <Check size={14} color="white" />}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center mb-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 mr-3"
          >
            <ArrowLeft size={24} color="#1D1D1F" />
          </motion.button>
          
          <span 
            className="text-[16px] font-medium"
            style={{ 
              color: '#007AFF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Invite Contractors
          </span>
        </div>
        
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-4"
        >
          <div className="relative">
            <Search size={20} color="#6B7280" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts"
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
              style={{
                backgroundColor: 'white',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
            />
            <button
              onClick={handleVoiceSearch}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${
                isVoiceSearchActive ? 'bg-red-100' : 'hover:bg-gray-100'
              }`}
            >
              <Mic size={16} color={isVoiceSearchActive ? "#FF3B30" : "#6B7280"} />
            </button>
          </div>
          
          {isVoiceSearchActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#FF3B30',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Listening...
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white px-5 py-3 border-b border-gray-100">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: allContacts.length },
            { key: 'contractors', label: 'Potential Contractors', count: contractorCount },
            { key: 'recent', label: 'Recent', count: allContacts.filter(c => c.lastContact).length },
            { key: 'favorites', label: 'Favorites', count: allContacts.filter(c => c.isFavorite).length }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                selectedFilter === filter.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span 
                className="text-[14px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                {filter.label} ({filter.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Header */}
      {selectedContacts.size > 0 && (
        <div className="bg-blue-50 px-5 py-3 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {selectedContacts.size} contractor{selectedContacts.size === 1 ? '' : 's'} selected
            </span>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSelectedPreview(!showSelectedPreview)}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                <span 
                  className="text-[14px]"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Preview
                </span>
                {showSelectedPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              <button
                onClick={handleClearSelection}
                className="text-[14px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Clear all
              </button>
            </div>
          </div>
          
          {/* Selected Contacts Preview */}
          <AnimatePresence>
            {showSelectedPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 space-y-2"
              >
                {selectedContactsData.slice(0, 3).map(contact => (
                  <div key={contact.id} className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-[10px] font-medium">
                        {getInitials(contact.name)}
                      </span>
                    </div>
                    <span 
                      className="text-blue-700"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                    >
                      {contact.name}
                    </span>
                  </div>
                ))}
                {selectedContactsData.length > 3 && (
                  <div 
                    className="text-[12px] text-blue-600"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                  >
                    +{selectedContactsData.length - 3} more
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="bg-white px-5 py-2 border-b border-gray-100 flex items-center justify-between">
        <button
          onClick={handleSelectAllVisible}
          className="text-[14px] text-blue-500 hover:text-blue-600 transition-colors duration-200"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
        >
          Select all visible ({filteredContacts.length})
        </button>
        
        <span 
          className="text-[12px] text-gray-500"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
        >
          {filteredContacts.length} of {allContacts.length} contacts
        </span>
      </div>

      {/* Contact List */}
      <div className="flex-1 bg-white overflow-y-auto pb-24">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <User size={48} color="#6B7280" className="mb-4" />
            <h3 
              className="text-[18px] font-medium mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              No contacts found
            </h3>
            <p 
              className="text-[14px] text-center"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div>
            {filteredContacts.map((contact, index) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      {selectedContacts.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => onContactsSelected(selectedContactsData)}
            className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Send {selectedContacts.size} invitation{selectedContacts.size === 1 ? '' : 's'}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}