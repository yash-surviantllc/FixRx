import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Smartphone,
  Edit3,
  Plus,
  Clock,
  Send,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  Star,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvitationPreviewScreenProps {
  onBack: () => void;
  onSendInvitations: (customization: InvitationCustomization) => void;
  selectedContacts: Contact[];
  vendorName?: string;
  vendorProfile?: VendorProfile;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  isLikelyContractor: boolean;
}

interface VendorProfile {
  firstName: string;
  lastName: string;
  rating: number;
  yearsExperience: number;
  services: string[];
}

interface InvitationCustomization {
  personalNote: string;
  includeProfile: boolean;
  includeReferralCode: boolean;
  sendTiming: 'now' | 'scheduled';
  scheduledDate?: Date;
  deliveryMethod: 'sms';
  batchSize: number;
}

export function InvitationPreviewScreen({ 
  onBack, 
  onSendInvitations, 
  selectedContacts, 
  vendorName = 'Mike Rodriguez',
  vendorProfile = {
    firstName: 'Mike',
    lastName: 'Rodriguez', 
    rating: 4.9,
    yearsExperience: 8,
    services: ['Plumbing', 'Emergency Repairs']
  }
}: InvitationPreviewScreenProps) {
  const [personalNote, setPersonalNote] = useState('');
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includeReferralCode, setIncludeReferralCode] = useState(true);
  const [sendTiming, setSendTiming] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [showPersonalNote, setShowPersonalNote] = useState(false);
  const [previewContactIndex, setPreviewContactIndex] = useState(0);
  const [showContactList, setShowContactList] = useState(false);
  const [removedContacts, setRemovedContacts] = useState<Set<string>>(new Set());

  const activeContacts = selectedContacts.filter(contact => !removedContacts.has(contact.id));
  const referralCode = `${vendorProfile.firstName.toUpperCase()}2024`;

  const generateMessage = (contactName: string) => {
    let baseMessage = `Hi ${contactName}! I'm ${vendorName}, using FixRx to connect with trusted clients. Join me to grow your business and find quality customers.`;
    
    if (includeProfile) {
      baseMessage += ` I'm a ${vendorProfile.rating}-star contractor with ${vendorProfile.yearsExperience} years experience in ${vendorProfile.services.join(' & ')}.`;
    }
    
    baseMessage += ` Download: fixrx.com/app`;
    
    if (includeReferralCode) {
      baseMessage += ` Use code: ${referralCode}`;
    }
    
    return baseMessage;
  };

  const baseMessageLength = generateMessage('Contact').length - 7; // Subtract 'Contact' and add average name length
  const personalNoteMessage = personalNote ? `\n\n${personalNote}` : '';
  const totalLength = baseMessageLength + personalNoteMessage.length;
  const willSendMultipleMessages = totalLength > 160;

  const handleRemoveContact = (contactId: string) => {
    setRemovedContacts(prev => new Set([...prev, contactId]));
    if (previewContactIndex >= activeContacts.length - 1 && previewContactIndex > 0) {
      setPreviewContactIndex(previewContactIndex - 1);
    }
  };

  const handleSendTest = () => {
    const testMessage = generateMessage('Your Name') + personalNoteMessage;
    alert(`Test message would be sent to your phone:\n\n${testMessage}`);
  };

  const handleSendInvitations = () => {
    const customization: InvitationCustomization = {
      personalNote,
      includeProfile,
      includeReferralCode,
      sendTiming,
      scheduledDate: sendTiming === 'scheduled' ? scheduledDate : undefined,
      deliveryMethod: 'sms',
      batchSize: 10
    };
    onSendInvitations(customization);
  };

  const previewContact = activeContacts[previewContactIndex];
  const previewMessage = previewContact ? generateMessage(previewContact.name) : '';

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
            Contact Selection
          </span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-[24px] font-bold mb-2"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Review invitations
          </h1>
          
          <p 
            className="text-[16px]"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Customize your message before sending
          </p>
        </motion.div>
      </div>

      <div className="px-5 pb-32">
        {/* Message Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Smartphone size={24} color="#6B7280" />
              <h2 
                className="text-[18px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Message Preview
              </h2>
            </div>
            
            {/* Phone Mockup */}
            <div className="relative mx-auto w-80 max-w-full">
              <div 
                className="bg-gray-900 rounded-3xl p-3"
                style={{ aspectRatio: '9/16' }}
              >
                <div className="bg-white rounded-2xl h-full p-4 flex flex-col">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between mb-4 text-black">
                    <span className="text-[12px] font-medium">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Messages Header */}
                  <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[12px] font-medium">
                        {vendorProfile.firstName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[14px] font-medium text-black">
                        {vendorName}
                      </h3>
                      <p className="text-[12px] text-gray-500">
                        Text Message
                      </p>
                    </div>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="space-y-2">
                      <div className="bg-blue-500 rounded-2xl rounded-br-md p-3 ml-8">
                        <p className="text-white text-[13px] leading-relaxed">
                          {previewMessage}
                        </p>
                      </div>
                      
                      {personalNote && (
                        <div className="bg-blue-500 rounded-2xl rounded-br-md p-3 ml-8">
                          <p className="text-white text-[13px] leading-relaxed">
                            {personalNote}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <span className="text-[11px] text-gray-400">
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Character Counter */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} color="#6B7280" />
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: totalLength > 160 ? '#FF3B30' : '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {totalLength}/160 characters
                </span>
              </div>
              
              {willSendMultipleMessages && (
                <div className="flex items-center space-x-1">
                  <Info size={16} color="#FF9500" />
                  <span 
                    className="text-[12px]"
                    style={{ 
                      color: '#FF9500',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Will send as 2 messages
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preview Contact Selector */}
        {activeContacts.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Preview for:
                </span>
                
                <select
                  value={previewContactIndex}
                  onChange={(e) => setPreviewContactIndex(parseInt(e.target.value))}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    color: '#1D1D1F'
                  }}
                >
                  {activeContacts.map((contact, index) => (
                    <option key={contact.id} value={index}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Customization Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Customization Options
            </h3>
            
            {/* Add Personal Note */}
            <div className="mb-4">
              <button
                onClick={() => setShowPersonalNote(!showPersonalNote)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-3">
                  <Plus size={20} color="#007AFF" />
                  <span 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#007AFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Add personal note
                  </span>
                </div>
                {showPersonalNote ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
              </button>
              
              <AnimatePresence>
                {showPersonalNote && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <textarea
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Great working with you on the Johnson project!"
                      className="w-full h-20 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
                      style={{
                        backgroundColor: 'white',
                        fontSize: '16px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                        color: '#1D1D1F'
                      }}
                      maxLength={100}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Additional characters will send as second message
                      </span>
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: personalNote.length > 80 ? '#FF3B30' : '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {personalNote.length}/100
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Message Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Message Settings
            </h3>
            
            <div className="space-y-4">
              {/* Include Profile Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Include my profile info
                  </h4>
                  <p 
                    className="text-[14px] mt-1"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Adds star rating, years experience, service types
                  </p>
                </div>
                
                <button
                  onClick={() => setIncludeProfile(!includeProfile)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    includeProfile ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      includeProfile ? 'transform translate-x-6' : 'transform translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              
              {/* Include Referral Code */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Include referral code
                  </h4>
                  <p 
                    className="text-[14px] mt-1"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Code: {referralCode}
                  </p>
                </div>
                
                <button
                  onClick={() => setIncludeReferralCode(!includeReferralCode)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    includeReferralCode ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      includeReferralCode ? 'transform translate-x-6' : 'transform translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Contacts Review */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Sending to: {activeContacts.length} contact{activeContacts.length === 1 ? '' : 's'}
              </h3>
              
              <button
                onClick={() => setShowContactList(!showContactList)}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                <span 
                  className="text-[14px]"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  {showContactList ? 'Hide' : 'Show'} list
                </span>
                {showContactList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            <AnimatePresence>
              {showContactList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {activeContacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#1D1D1F',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {contact.name}
                        </h4>
                        <p 
                          className="text-[14px]"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {contact.phone}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        <X size={16} color="#6B7280" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Delivery Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Delivery Options
            </h3>
            
            <div className="space-y-4">
              {/* Send Timing */}
              <div>
                <h4 
                  className="text-[16px] font-medium mb-3"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Send timing
                </h4>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="timing"
                      checked={sendTiming === 'now'}
                      onChange={() => setSendTiming('now')}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span 
                      className="text-[16px]"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Send now
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="timing"
                      checked={sendTiming === 'scheduled'}
                      onChange={() => setSendTiming('scheduled')}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span 
                      className="text-[16px]"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Schedule for later
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Batch Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info size={16} color="#007AFF" />
                  <h4 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#007AFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Smart delivery
                  </h4>
                </div>
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Messages will be sent in batches of 10 to avoid spam detection
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Preview Controls
            </h3>
            
            <button
              onClick={handleSendTest}
              className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
            >
              <Eye size={20} color="#6B7280" />
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Send test message to my phone
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleSendInvitations}
            disabled={activeContacts.length === 0}
            className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: activeContacts.length > 0 
                ? 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' 
                : '#E5E7EB',
              boxShadow: activeContacts.length > 0 
                ? '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                : 'none'
            }}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Send {activeContacts.length} invitation{activeContacts.length === 1 ? '' : 's'}
            </span>
          </motion.button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPersonalNote(true)}
              className="flex-1 h-12 rounded-xl border-2 border-blue-500 bg-white hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Edit3 size={16} color="#007AFF" />
              <span 
                className="text-blue-500 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Edit message
              </span>
            </button>
            
            <button
              onClick={onBack}
              className="flex-1 h-12 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
            >
              <span 
                className="text-gray-700 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Change contacts
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}