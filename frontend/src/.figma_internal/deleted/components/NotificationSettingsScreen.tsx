import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Bell,
  Settings,
  Smartphone,
  Mail,
  MessageSquare,
  Shield,
  Clock,
  Moon,
  Zap,
  BarChart3,
  HelpCircle,
  AlertTriangle,
  Check,
  X,
  Volume2,
  VolumeX,
  Vibrate,
  ChevronDown,
  ChevronUp,
  Info,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  CreditCard,
  ShieldCheck,
  Megaphone,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationSettingsScreenProps {
  onBack: () => void;
  onTestNotification?: () => void;
  userType?: 'consumer' | 'vendor';
  userEmail?: string;
  userPhone?: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon?: React.ReactNode;
  recommended?: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  settings: NotificationSetting[];
}

export function NotificationSettingsScreen({ 
  onBack, 
  onTestNotification,
  userType = 'consumer',
  userEmail = 'user@example.com',
  userPhone = '+1 (555) 123-4567'
}: NotificationSettingsScreenProps) {
  const [globalNotifications, setGlobalNotifications] = useState(true);
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'service',
      title: 'Service Updates',
      description: 'Updates about your service requests and appointments',
      icon: <Briefcase size={24} color="#007AFF" />,
      settings: [
        {
          id: 'contractor_responses',
          label: 'Contractor responses',
          description: 'When contractors reply to your requests',
          enabled: true,
          icon: <MessageSquare size={18} color="#007AFF" />
        },
        {
          id: 'appointment_confirmations',
          label: 'Appointment confirmations',
          description: 'Scheduling and timing updates',
          enabled: true,
          icon: <Calendar size={18} color="#007AFF" />
        },
        {
          id: 'service_completions',
          label: 'Service completions',
          description: 'When work is finished and ready to review',
          enabled: true,
          icon: <Check size={18} color="#34D399" />
        },
        {
          id: 'payment_confirmations',
          label: 'Payment confirmations',
          description: 'Transaction receipts and billing updates',
          enabled: true,
          icon: <CreditCard size={18} color="#8B5CF6" />
        },
        {
          id: 'emergency_availability',
          label: 'Emergency service availability',
          description: 'Urgent service opportunities nearby',
          enabled: false,
          icon: <AlertTriangle size={18} color="#F59E0B" />
        }
      ]
    },
    {
      id: 'friend',
      title: 'Friend Activity',
      description: 'Updates about your friend network and recommendations',
      icon: <Users size={24} color="#10B981" />,
      settings: [
        {
          id: 'contractor_recommendations',
          label: 'New contractor recommendations',
          description: 'When friends add contractors you might like',
          enabled: true,
          icon: <Star size={18} color="#F59E0B" />
        },
        {
          id: 'service_reviews',
          label: 'Friend service reviews',
          description: 'When friends complete and rate services',
          enabled: true,
          icon: <Star size={18} color="#10B981" />
        },
        {
          id: 'network_growth',
          label: 'Network growth updates',
          description: 'New friend connections and milestones',
          enabled: false,
          icon: <Users size={18} color="#10B981" />
        },
        {
          id: 'community_milestones',
          label: 'Community milestones',
          description: 'Special achievements and celebrations',
          enabled: false,
          icon: <Megaphone size={18} color="#F59E0B" />
        }
      ]
    },
    {
      id: 'system',
      title: 'System Messages',
      description: 'Important account and security updates',
      icon: <Shield size={24} color="#8B5CF6" />,
      settings: [
        {
          id: 'account_security',
          label: 'Account security',
          description: 'Login alerts and security notifications',
          enabled: true,
          recommended: true,
          icon: <ShieldCheck size={18} color="#DC2626" />
        },
        {
          id: 'verification_updates',
          label: 'Verification status updates',
          description: 'Contractor verification and document status',
          enabled: true,
          icon: <Shield size={18} color="#059669" />
        },
        {
          id: 'policy_changes',
          label: 'Policy changes',
          description: 'Terms of service and privacy updates',
          enabled: true,
          icon: <Info size={18} color="#6B7280" />
        },
        {
          id: 'feature_announcements',
          label: 'Feature announcements',
          description: 'New features and app improvements',
          enabled: false,
          icon: <Zap size={18} color="#007AFF" />
        }
      ]
    }
  ]);

  // Delivery method settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [pushTiming, setPushTiming] = useState<'immediate' | 'bundled' | 'daily'>('immediate');
  const [pushSound, setPushSound] = useState<'default' | 'custom' | 'silent'>('default');
  const [pushVibration, setPushVibration] = useState(true);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState<'immediate' | 'daily' | 'weekly'>('daily');

  const [smsNotifications, setSmsNotifications] = useState(false);

  // Advanced settings
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');
  const [quietDays, setQuietDays] = useState(['saturday', 'sunday']);
  const [allowEmergency, setAllowEmergency] = useState(true);

  const [smartTiming, setSmartTiming] = useState(true);
  const [contextAware, setContextAware] = useState(false);
  const [batchSimilar, setBatchSimilar] = useState(true);

  // Privacy settings
  const [showPreviews, setShowPreviews] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [historyRetention, setHistoryRetention] = useState<7 | 14 | 30>(7);

  const [expandedSections, setExpandedSections] = useState<string[]>(['delivery', 'advanced']);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleGlobalToggle = (enabled: boolean) => {
    setGlobalNotifications(enabled);
    if (!enabled) {
      // Disable all individual settings
      setCategories(prev => prev.map(category => ({
        ...category,
        settings: category.settings.map(setting => ({ ...setting, enabled: false }))
      })));
    }
  };

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, settings: category.settings.map(s => ({ ...s, enabled })) }
        : category
    ));
  };

  const handleSettingToggle = (categoryId: string, settingId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            settings: category.settings.map(setting => 
              setting.id === settingId 
                ? { ...setting, enabled: !setting.enabled }
                : setting
            )
          }
        : category
    ));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleResetDefaults = () => {
    // Reset to default settings
    setGlobalNotifications(true);
    setPushNotifications(true);
    setPushTiming('immediate');
    setPushSound('default');
    setPushVibration(true);
    setEmailNotifications(true);
    setEmailFrequency('daily');
    setSmsNotifications(false);
    setQuietHours(false);
    setSmartTiming(true);
    setContextAware(false);
    setBatchSimilar(true);
    setShowPreviews(true);
    setShowBadges(true);
    setHistoryRetention(7);
    
    // Reset category settings
    setCategories(prev => prev.map(category => ({
      ...category,
      settings: category.settings.map(setting => ({
        ...setting,
        enabled: setting.recommended !== false
      }))
    })));
  };

  const handleTestNotification = () => {
    if (onTestNotification) {
      onTestNotification();
    } else {
      // Mock test notification
      alert('Test notification sent! Check your device for the sample notification.');
    }
  };

  const dayLabels = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft size={24} color="#1D1D1F" />
            </motion.button>
            
            <div>
              <h1 
                className="text-[28px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Notification Settings
              </h1>
              <p 
                className="text-[16px] mt-1"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Customize how you want to be notified
              </p>
            </div>
          </div>
        </div>

        {/* Global Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell size={20} color="#007AFF" />
            </div>
            <div>
              <h3 
                className="text-[18px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                All Notifications
              </h3>
              <p 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Master control for all notifications
              </p>
            </div>
          </div>
          
          <button
            onClick={() => handleGlobalToggle(!globalNotifications)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              globalNotifications ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                globalNotifications ? 'transform translate-x-6' : 'transform translate-x-0.5'
              }`}
            />
          </button>
        </motion.div>
      </div>

      <div className="px-5 py-6 pb-32">
        {/* Notification Categories */}
        <div className="space-y-6">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (categoryIndex * 0.1) }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <div>
                    <h3 
                      className="text-[20px] font-bold"
                      style={{ 
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {category.title}
                    </h3>
                    <p 
                      className="text-[14px] mt-1"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCategoryToggle(category.id, !category.settings.some(s => s.enabled))}
                  className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  disabled={!globalNotifications}
                >
                  <span 
                    className="text-[12px] font-medium"
                    style={{ 
                      color: globalNotifications ? '#6B7280' : '#9CA3AF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {category.settings.some(s => s.enabled) ? 'Disable all' : 'Enable all'}
                  </span>
                </button>
              </div>
              
              <div className="space-y-4">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {setting.icon}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 
                            className="text-[16px] font-medium"
                            style={{ 
                              color: '#1D1D1F',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {setting.label}
                          </h4>
                          {setting.recommended && (
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p 
                          className="text-[14px] mt-1"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSettingToggle(category.id, setting.id)}
                      disabled={!globalNotifications}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        setting.enabled && globalNotifications ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          setting.enabled && globalNotifications ? 'transform translate-x-6' : 'transform translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delivery Method Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <button
            onClick={() => toggleSection('delivery')}
            className="w-full bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Smartphone size={24} color="#8B5CF6" />
              <h3 
                className="text-[20px] font-bold"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Delivery Methods
              </h3>
            </div>
            {expandedSections.includes('delivery') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <AnimatePresence>
            {expandedSections.includes('delivery') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl mt-4 p-6 border border-gray-100 shadow-sm space-y-6"
              >
                {/* Push Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Smartphone size={20} color="#007AFF" />
                      <h4 
                        className="text-[18px] font-bold"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Push Notifications
                      </h4>
                    </div>
                    <button
                      onClick={() => setPushNotifications(!pushNotifications)}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        pushNotifications ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          pushNotifications ? 'transform translate-x-6' : 'transform translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {pushNotifications && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <label 
                          className="text-[14px] font-medium block mb-2"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Timing
                        </label>
                        <div className="flex space-x-2">
                          {[
                            { value: 'immediate', label: 'Immediate' },
                            { value: 'bundled', label: 'Bundled (hourly)' },
                            { value: 'daily', label: 'Daily digest' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setPushTiming(option.value as any)}
                              className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-200 ${
                                pushTiming === option.value
                                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label 
                          className="text-[14px] font-medium block mb-2"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Sound
                        </label>
                        <div className="flex space-x-2">
                          {[
                            { value: 'default', label: 'Default', icon: <Volume2 size={14} /> },
                            { value: 'custom', label: 'Custom', icon: <Settings size={14} /> },
                            { value: 'silent', label: 'Silent', icon: <VolumeX size={14} /> }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setPushSound(option.value as any)}
                              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-200 ${
                                pushSound === option.value
                                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {option.icon}
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Vibrate size={16} color="#6B7280" />
                          <span 
                            className="text-[14px] font-medium"
                            style={{ 
                              color: '#374151',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            Vibration
                          </span>
                        </div>
                        <button
                          onClick={() => setPushVibration(!pushVibration)}
                          className={`w-12 h-6 rounded-full transition-all duration-200 ${
                            pushVibration ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <div 
                            className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              pushVibration ? 'transform translate-x-6' : 'transform translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Notifications */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Mail size={20} color="#8B5CF6" />
                      <div>
                        <h4 
                          className="text-[18px] font-bold"
                          style={{ 
                            color: '#1D1D1F',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Email Notifications
                        </h4>
                        <p 
                          className="text-[12px] text-gray-500"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        >
                          {userEmail}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        emailNotifications ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          emailNotifications ? 'transform translate-x-6' : 'transform translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {emailNotifications && (
                    <div className="ml-6">
                      <label 
                        className="text-[14px] font-medium block mb-2"
                        style={{ 
                          color: '#374151',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Frequency
                      </label>
                      <div className="flex space-x-2">
                        {[
                          { value: 'immediate', label: 'Immediate' },
                          { value: 'daily', label: 'Daily digest' },
                          { value: 'weekly', label: 'Weekly summary' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setEmailFrequency(option.value as any)}
                            className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-200 ${
                              emailFrequency === option.value
                                ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SMS Notifications */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <MessageSquare size={20} color="#F59E0B" />
                      <div>
                        <h4 
                          className="text-[18px] font-bold"
                          style={{ 
                            color: '#1D1D1F',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Text Messages
                        </h4>
                        <div className="flex items-center space-x-2">
                          <p 
                            className="text-[12px] text-gray-500"
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                          >
                            {userPhone}
                          </p>
                          <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-[8px] font-bold">
                            PREMIUM
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSmsNotifications(!smsNotifications)}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        smsNotifications ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          smsNotifications ? 'transform translate-x-6' : 'transform translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {smsNotifications && (
                    <div className="ml-6">
                      <p 
                        className="text-[12px] text-gray-500 mb-2"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                      >
                        Limited to critical updates only (emergency services, security alerts)
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Advanced Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Settings size={24} color="#F59E0B" />
              <h3 
                className="text-[20px] font-bold"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Advanced Settings
              </h3>
            </div>
            {expandedSections.includes('advanced') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <AnimatePresence>
            {expandedSections.includes('advanced') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl mt-4 p-6 border border-gray-100 shadow-sm space-y-6"
              >
                {/* Quiet Hours */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Moon size={20} color="#6B7280" />
                      <h4 
                        className="text-[18px] font-bold"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Quiet Hours
                      </h4>
                    </div>
                    <button
                      onClick={() => setQuietHours(!quietHours)}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        quietHours ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          quietHours ? 'transform translate-x-6' : 'transform translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {quietHours && (
                    <div className="space-y-4 ml-6">
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label 
                            className="text-[12px] font-medium block mb-1"
                            style={{ 
                              color: '#6B7280',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            Start time
                          </label>
                          <input
                            type="time"
                            value={quietStart}
                            onChange={(e) => setQuietStart(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-[14px]"
                          />
                        </div>
                        <div className="flex-1">
                          <label 
                            className="text-[12px] font-medium block mb-1"
                            style={{ 
                              color: '#6B7280',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            End time
                          </label>
                          <input
                            type="time"
                            value={quietEnd}
                            onChange={(e) => setQuietEnd(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-[14px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label 
                          className="text-[12px] font-medium block mb-2"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Days of week
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {dayLabels.map((day) => (
                            <button
                              key={day.id}
                              onClick={() => setQuietDays(prev => 
                                prev.includes(day.id) 
                                  ? prev.filter(d => d !== day.id)
                                  : [...prev, day.id]
                              )}
                              className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-200 ${
                                quietDays.includes(day.id)
                                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle size={16} color="#F59E0B" />
                          <span 
                            className="text-[14px] font-medium"
                            style={{ 
                              color: '#374151',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            Allow emergency notifications
                          </span>
                        </div>
                        <button
                          onClick={() => setAllowEmergency(!allowEmergency)}
                          className={`w-12 h-6 rounded-full transition-all duration-200 ${
                            allowEmergency ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <div 
                            className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              allowEmergency ? 'transform translate-x-6' : 'transform translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Smart Notifications */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h4 
                    className="text-[18px] font-bold flex items-center space-x-2"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    <Zap size={20} color="#F59E0B" />
                    <span>Smart Notifications</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          AI-powered timing
                        </h5>
                        <p 
                          className="text-[12px] text-gray-500"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        >
                          Sends notifications at optimal times based on your activity
                        </p>
                      </div>
                      <button
                        onClick={() => setSmartTiming(!smartTiming)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          smartTiming ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div 
                          className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            smartTiming ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Context awareness
                        </h5>
                        <p 
                          className="text-[12px] text-gray-500"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        >
                          Uses location and calendar to improve notification relevance
                        </p>
                      </div>
                      <button
                        onClick={() => setContextAware(!contextAware)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          contextAware ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div 
                          className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            contextAware ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Batch similar notifications
                        </h5>
                        <p 
                          className="text-[12px] text-gray-500"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        >
                          Groups related updates to reduce notification noise
                        </p>
                      </div>
                      <button
                        onClick={() => setBatchSimilar(!batchSimilar)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          batchSimilar ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div 
                          className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            batchSimilar ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h4 
                    className="text-[18px] font-bold flex items-center space-x-2"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    <Shield size={20} color="#059669" />
                    <span>Privacy Controls</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Notification preview
                        </h5>
                        <p 
                          className="text-[12px] text-gray-500"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        >
                          Show notification content on lock screen
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPreviews(!showPreviews)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          showPreviews ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div 
                          className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            showPreviews ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Badge counts
                        </h5>
                        <p 
                          className="text-[12px] text-gray-500"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        >
                          Red number badges on app icon
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBadges(!showBadges)}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          showBadges ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div 
                          className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            showBadges ? 'transform translate-x-6' : 'transform translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <h5 
                        className="text-[16px] font-medium mb-2"
                        style={{ 
                          color: '#374151',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        Notification history retention
                      </h5>
                      <p 
                        className="text-[12px] text-gray-500 mb-3"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                      >
                        How long to keep notification history
                      </p>
                      <div className="flex space-x-2">
                        {[
                          { value: 7, label: '7 days' },
                          { value: 14, label: '14 days' },
                          { value: 30, label: '30 days' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setHistoryRetention(option.value as any)}
                            className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-200 ${
                              historyRetention === option.value
                                ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 
            className="text-[18px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Additional Options
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setShowAnalytics(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <BarChart3 size={20} color="#6B7280" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Notification Analytics
                </span>
              </div>
              <ChevronDown size={16} color="#9CA3AF" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <HelpCircle size={20} color="#6B7280" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Why am I getting this?
                </span>
              </div>
              <ChevronDown size={16} color="#9CA3AF" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle size={20} color="#F59E0B" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Report notification issues
                </span>
              </div>
              <ChevronDown size={16} color="#9CA3AF" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          <div className="flex space-x-3">
            <button
              onClick={handleTestNotification}
              className="flex-1 h-12 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-200 active:scale-[0.98]"
            >
              <span 
                className="text-blue-600 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Test Notifications
              </span>
            </button>
            
            <button
              onClick={handleResetDefaults}
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
            >
              <span 
                className="text-gray-600 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Reset to Defaults
              </span>
            </button>
          </div>
          
          <button
            onClick={() => {
              console.log('Saving notification preferences...');
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
              Save Preferences
            </span>
          </button>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-5 z-50"
            onClick={() => setShowAnalytics(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-[20px] font-bold"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Notification Analytics
                </h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X size={20} color="#6B7280" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Notifications sent this week
                    </span>
                    <span 
                      className="text-[24px] font-bold"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      23
                    </span>
                  </div>
                  <div className="text-[12px] text-green-600 font-medium">↑ 15% from last week</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Average engagement rate
                    </span>
                    <span 
                      className="text-[24px] font-bold"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      82%
                    </span>
                  </div>
                  <div className="text-[12px] text-blue-600 font-medium">Excellent engagement</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-[14px] font-medium mb-2" style={{ color: '#6B7280' }}>
                    Most engaging notification type
                  </div>
                  <div className="text-[16px] font-bold" style={{ color: '#1D1D1F' }}>
                    Contractor responses
                  </div>
                  <div className="text-[12px] text-gray-500">95% open rate</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowAnalytics(false)}
                className="w-full mt-6 h-12 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              >
                <span className="text-white text-[16px] font-medium">Close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}