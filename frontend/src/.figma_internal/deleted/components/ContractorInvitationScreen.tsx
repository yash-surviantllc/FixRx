import { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Network, 
  Share2, 
  UserPlus, 
  Phone, 
  ChevronDown,
  ChevronUp,
  Copy,
  QrCode,
  X,
  Plus,
  Shield,
  Facebook,
  MessageSquare,
  ExternalLink,
  ContactIcon as Contact
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContractorInvitationScreenProps {
  onBack: () => void;
  onAccessContacts?: () => void;
  vendorName?: string;
}

interface ManualContractor {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
}

// LinkedIn Icon Component
const LinkedInIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.9 3.488"/>
  </svg>
);

const serviceTypes = [
  'Plumbing',
  'Electrical',
  'HVAC', 
  'Construction',
  'Handyman',
  'Roofing',
  'Flooring',
  'Painting',
  'Landscaping',
  'Cleaning'
];

export function ContractorInvitationScreen({ onBack, onAccessContacts, vendorName = 'Mike' }: ContractorInvitationScreenProps) {
  const [showBenefits, setShowBenefits] = useState(false);
  const [contactsPermissionRequested, setContactsPermissionRequested] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualContractors, setManualContractors] = useState<ManualContractor[]>([]);
  const [newContractor, setNewContractor] = useState({
    name: '',
    phone: '',
    serviceType: serviceTypes[0]
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [linkedInFound, setLinkedInFound] = useState(12);

  const handleRequestContactsPermission = async () => {
    setContactsPermissionRequested(true);
    
    // Navigate to contact selection screen
    if (onAccessContacts) {
      onAccessContacts();
    } else {
      // Fallback to manual entry if no callback provided
      setTimeout(() => {
        setShowManualEntry(true);
      }, 1000);
    }
  };

  const handleAddManualContractor = () => {
    if (newContractor.name && newContractor.phone) {
      const contractor: ManualContractor = {
        id: Date.now().toString(),
        ...newContractor
      };
      setManualContractors([...manualContractors, contractor]);
      setNewContractor({ name: '', phone: '', serviceType: serviceTypes[0] });
    }
  };

  const handleRemoveContractor = (id: string) => {
    setManualContractors(manualContractors.filter(c => c.id !== id));
  };

  const handleCopyLink = async () => {
    const inviteLink = `https://fixrx.com/invite/${vendorName.toLowerCase().replace(' ', '-')}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleShare = (platform: string) => {
    const message = `Join me on FixRx! I'm ${vendorName} and I think you'd be a great addition to our contractor network.`;
    const url = `https://fixrx.com/invite/${vendorName.toLowerCase().replace(' ', '-')}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
        break;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="relative pt-5 pb-6 bg-white border-b border-gray-100">
        <div className="px-5">
          <div className="flex items-center mb-6">
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
              Dashboard
            </span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 
              className="text-[28px] font-bold mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Grow Your Network
            </h1>
            
            <p 
              className="text-[16px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Invite trusted contractors to join FixRx
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 mb-8"
        >
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <h2 
                className="text-[18px] font-bold text-left"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Why invite contractors?
              </h2>
              
              {showBenefits ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </div>
            
            <AnimatePresence>
              {showBenefits && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <DollarSign size={20} color="#059669" className="mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p 
                        className="text-[16px] font-medium mb-1"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Earn referral bonuses
                      </p>
                      <p 
                        className="text-[14px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        $50 credit for each contractor who joins and completes 3 services
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Network size={20} color="#007AFF" className="mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p 
                        className="text-[16px] font-medium mb-1"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Build professional network
                      </p>
                      <p 
                        className="text-[14px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Connect with trusted professionals in your area
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Share2 size={20} color="#F59E0B" className="mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p 
                        className="text-[16px] font-medium mb-1"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Share overflow work
                      </p>
                      <p 
                        className="text-[14px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Refer jobs when you're busy or outside your expertise
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Contact Permission Request */}
        {!contactsPermissionRequested && !showManualEntry && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E8F2FF' }}
                >
                  <Contact size={24} color="#007AFF" />
                </div>
                
                <h3 
                  className="text-[20px] font-bold mb-2"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Access your contacts
                </h3>
                
                <p 
                  className="text-[16px] mb-4"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Find contractors you know and trust in your contact list
                </p>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-6">
                  <p 
                    className="text-[14px]"
                    style={{ 
                      color: '#007AFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    We'll only show contacts who might be contractors
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleRequestContactsPermission}
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
                      Allow contact access
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowManualEntry(true)}
                    className="w-full h-12 rounded-xl border-2 border-blue-500 bg-white hover:bg-blue-50 transition-all duration-200 active:scale-[0.98]"
                  >
                    <span 
                      className="text-blue-500 text-[16px] font-medium"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                    >
                      Enter manually instead
                    </span>
                  </button>
                </div>
                
                <div className="flex items-center justify-center mt-4 space-x-1">
                  <Shield size={14} color="#059669" />
                  <p 
                    className="text-[12px]"
                    style={{ 
                      color: '#059669',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    We respect your privacy - contacts are never stored
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manual Entry Option */}
        {showManualEntry && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 
                className="text-[18px] font-bold mb-4"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Add contractor manually
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label 
                    className="block text-[16px] font-medium mb-2"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={newContractor.name}
                    onChange={(e) => setNewContractor({ ...newContractor, name: e.target.value })}
                    placeholder="Enter contractor's full name"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                    style={{
                      backgroundColor: 'white',
                      fontSize: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      color: '#1D1D1F'
                    }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-[16px] font-medium mb-2"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContractor.phone}
                    onChange={(e) => setNewContractor({ ...newContractor, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                    style={{
                      backgroundColor: 'white',
                      fontSize: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      color: '#1D1D1F'
                    }}
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-[16px] font-medium mb-2"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Service Type
                  </label>
                  <select
                    value={newContractor.serviceType}
                    onChange={(e) => setNewContractor({ ...newContractor, serviceType: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                    style={{
                      backgroundColor: 'white',
                      fontSize: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      color: '#1D1D1F'
                    }}
                  >
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleAddManualContractor}
                  disabled={!newContractor.name || !newContractor.phone}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#007AFF' }}
                >
                  <Plus size={16} />
                  <span 
                    className="text-[16px] font-medium"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                  >
                    Add another contractor
                  </span>
                </button>
              </div>
              
              {/* Added Contractors Preview */}
              {manualContractors.length > 0 && (
                <div>
                  <h4 
                    className="text-[16px] font-medium mb-3"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Contractors to invite ({manualContractors.length})
                  </h4>
                  
                  <div className="space-y-2">
                    {manualContractors.map(contractor => (
                      <div key={contractor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p 
                            className="text-[16px] font-medium"
                            style={{ 
                              color: '#1D1D1F',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {contractor.name}
                          </p>
                          <p 
                            className="text-[14px]"
                            style={{ 
                              color: '#6B7280',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {formatPhoneNumber(contractor.phone)} • {contractor.serviceType}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveContractor(contractor.id)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                        >
                          <X size={16} color="#6B7280" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Professional Network Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Import from LinkedIn
            </h3>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <LinkedInIcon size={20} />
                <p 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#0077B5',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Found {linkedInFound} potential contractors in your network
                </p>
              </div>
              
              <p 
                className="text-[14px] mb-4"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Showing only construction and home service connections
              </p>
            </div>
            
            <button
              onClick={() => alert('LinkedIn integration would be implemented here')}
              className="w-full h-12 rounded-xl border-2 border-blue-500 bg-white hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <LinkedInIcon size={20} />
              <span 
                className="text-blue-500 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Import from LinkedIn
              </span>
            </button>
          </div>
        </motion.div>

        {/* Alternative Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 
              className="text-[18px] font-bold mb-4"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Share invitation link
            </h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
              >
                {copiedLink ? (
                  <>
                    <Users size={20} color="#059669" />
                    <span 
                      className="text-[16px] font-medium"
                      style={{ 
                        color: '#059669',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Link copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy size={20} color="#6B7280" />
                    <span 
                      className="text-[16px] font-medium"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Copy invitation link
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
              >
                <QrCode size={20} color="#6B7280" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Show QR code for easy sharing
                </span>
              </button>
            </div>

            {/* QR Code Display */}
            <AnimatePresence>
              {showQRCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-6"
                >
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode size={40} color="#6B7280" />
                  </div>
                  <p 
                    className="text-[14px] mt-2"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    QR Code for invitation link
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Sharing */}
            <div>
              <h4 
                className="text-[16px] font-medium mb-3"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Share on social media
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <Facebook size={20} color="#1877F2" />
                  <span 
                    className="text-[12px] font-medium"
                    style={{ 
                      color: '#1877F2',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Facebook
                  </span>
                </button>

                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <LinkedInIcon size={20} />
                  <span 
                    className="text-[12px] font-medium"
                    style={{ 
                      color: '#0077B5',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    LinkedIn
                  </span>
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200"
                >
                  <WhatsAppIcon size={20} />
                  <span 
                    className="text-[12px] font-medium"
                    style={{ 
                      color: '#25D366',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    WhatsApp
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Action */}
      {manualContractors.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              console.log('Sending invitations to:', manualContractors);
              alert(`Sending invitations to ${manualContractors.length} contractor${manualContractors.length === 1 ? '' : 's'}!`);
              onBack();
            }}
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
              Send {manualContractors.length} invitation{manualContractors.length === 1 ? '' : 's'}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}