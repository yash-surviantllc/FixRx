import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, MoreHorizontal, Paperclip, Camera, Send, FileText, Calendar, DollarSign, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MessagingScreenProps {
  onBack: () => void;
  vendorName?: string;
  vendorService?: string;
  vendorAvatar?: string;
  initialProgress?: 'quoted' | 'scheduled' | 'completed';
  hasBottomNav?: boolean;
}

interface Message {
  id: string;
  type: 'text' | 'invoice' | 'payment' | 'appointment' | 'image';
  content: string;
  timestamp: Date;
  sender: 'user' | 'vendor';
  data?: any;
}

export function MessagingScreen({ 
  onBack, 
  vendorName = 'Mike Rodriguez',
  vendorService = 'Plumbing Service',
  vendorAvatar = 'https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwY29udHJhY3RvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzkxMjMxMnww&ixlib=rb-4.1.0&q=80&w=400',
  initialProgress = 'quoted',
  hasBottomNav = false
}: MessagingScreenProps) {
  const [messageText, setMessageText] = useState('');
  const [isVendorOnline] = useState(true);
  const [currentProgress, setCurrentProgress] = useState<'quoted' | 'scheduled' | 'completed'>(initialProgress);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      content: "Hi! I saw your request for bathroom plumbing work. I'd be happy to help!",
      timestamp: new Date(Date.now() - 3600000),
      sender: 'vendor'
    },
    {
      id: '2',
      type: 'text',
      content: 'Great! Can you provide a quote for replacing the sink and fixing the shower leak?',
      timestamp: new Date(Date.now() - 3500000),
      sender: 'user'
    },
    {
      id: '3',
      type: 'invoice',
      content: 'Quote for bathroom plumbing work',
      timestamp: new Date(Date.now() - 3000000),
      sender: 'vendor',
      data: {
        amount: 485,
        description: 'Sink replacement + shower leak repair',
        items: ['Sink installation: $285', 'Shower leak repair: $200']
      }
    },
    {
      id: '4',
      type: 'text',
      content: 'Looks good! When can you start?',
      timestamp: new Date(Date.now() - 2500000),
      sender: 'user'
    },
    {
      id: '5',
      type: 'appointment',
      content: 'Scheduled service appointment',
      timestamp: new Date(Date.now() - 2000000),
      sender: 'vendor',
      data: {
        date: 'Tomorrow, Sep 16',
        time: '2:00 PM - 4:00 PM',
        type: 'Bathroom Plumbing Service'
      }
    },
    {
      id: '6',
      type: 'image',
      content: 'Progress photo from today',
      timestamp: new Date(Date.now() - 1000000),
      sender: 'vendor',
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1664227430687-9299c593e3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbm92YXRpb24lMjBwcm9ncmVzcyUyMHBob3RvfGVufDF8fHx8MTc1NzkyNDA5NXww&ixlib=rb-4.1.0&q=80&w=400',
        caption: 'Sink installation complete'
      }
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: messageText,
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  // Function to advance progress based on message actions
  const handleProgressAdvancement = (messageType: string, action?: string) => {
    if (messageType === 'invoice' && action === 'accept') {
      // Stay in quoted stage but show scheduling coordination
      
      // Add user's acceptance message first
      const acceptanceMessage: Message = {
        id: Date.now().toString(),
        type: 'text',
        content: 'Quote accepted! When would be a good time for you to start the work?',
        timestamp: new Date(),
        sender: 'user'
      };
      setMessages(prev => [...prev, acceptanceMessage]);
      
      // Add contractor's scheduling response
      setTimeout(() => {
        const schedulingMessage: Message = {
          id: Date.now().toString(),
          type: 'text',
          content: 'Great! I have availability tomorrow (Sep 16) between 2-4 PM, or Thursday morning. What works better for you?',
          timestamp: new Date(),
          sender: 'vendor'
        };
        setMessages(prev => [...prev, schedulingMessage]);
      }, 2000);
      
      // Add time confirmation after user would respond
      setTimeout(() => {
        const confirmationMessage: Message = {
          id: Date.now().toString(),
          type: 'text',
          content: 'Tomorrow 2-4 PM works perfectly! See you then.',
          timestamp: new Date(),
          sender: 'user'
        };
        setMessages(prev => [...prev, confirmationMessage]);
      }, 4000);
      
      // Finally create the scheduled appointment and advance progress
      setTimeout(() => {
        setCurrentProgress('scheduled');
        const appointmentMessage: Message = {
          id: Date.now().toString(),
          type: 'appointment',
          content: 'Service appointment confirmed',
          timestamp: new Date(),
          sender: 'vendor',
          data: {
            date: 'Tomorrow, Sep 16',
            time: '2:00 PM - 4:00 PM',
            type: vendorService,
            status: 'confirmed'
          }
        };
        setMessages(prev => [...prev, appointmentMessage]);
      }, 6000);
      
    } else if (messageType === 'completion' && action === 'confirm') {
      // Show realistic completion flow
      const arrivalMessage: Message = {
        id: Date.now().toString(),
        type: 'text',
        content: "I'm here and getting started on the work! 🔧",
        timestamp: new Date(),
        sender: 'vendor'
      };
      setMessages(prev => [...prev, arrivalMessage]);
      
      // Show progress update
      setTimeout(() => {
        const progressMessage: Message = {
          id: Date.now().toString(),
          type: 'text',
          content: "Work is going well! Should be finished within the next hour.",
          timestamp: new Date(),
          sender: 'vendor'
        };
        setMessages(prev => [...prev, progressMessage]);
      }, 2000);
      
      // Show completion photo
      setTimeout(() => {
        const photoMessage: Message = {
          id: Date.now().toString(),
          type: 'image',
          content: 'Work completed!',
          timestamp: new Date(),
          sender: 'vendor',
          data: {
            imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wbGV0ZWQlMjBwbHVtYmluZyUyMHdvcmt8ZW58MXx8fHwxNzU3OTI0MDk1fDA&ixlib=rb-4.1.0&q=80&w=400',
            caption: 'All finished! New sink installed and leak fixed.'
          }
        };
        setMessages(prev => [...prev, photoMessage]);
      }, 4000);
      
      // Mark as completed
      setTimeout(() => {
        setCurrentProgress('completed');
        const completionMessage: Message = {
          id: Date.now().toString(),
          type: 'text',
          content: 'Service completed! Thank you for choosing FixRx. Please rate your experience when you have a chance. 🌟',
          timestamp: new Date(),
          sender: 'vendor'
        };
        setMessages(prev => [...prev, completionMessage]);
      }, 6000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (type: string) => {
    setShowAttachmentOptions(false);
    
    if (type === 'complete') {
      handleProgressAdvancement('completion', 'confirm');
      return;
    }
    
    console.log(`${type} selected`);
    // Would implement actual file selection logic
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getProgressStepStyle = (step: string) => {
    const steps = ['quoted', 'scheduled', 'completed'];
    const currentIndex = steps.indexOf(currentProgress);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex <= currentIndex) {
      return {
        backgroundColor: stepIndex === currentIndex ? '#007AFF' : '#059669',
        borderColor: stepIndex === currentIndex ? '#007AFF' : '#059669'
      };
    }
    return {
      backgroundColor: '#E5E7EB',
      borderColor: '#E5E7EB'
    };
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    switch (message.type) {
      case 'invoice':
        return (
          <div className="w-full max-w-xs">
            <div 
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <FileText size={16} color="#007AFF" />
                <span className="text-[14px] font-medium" style={{ color: '#374151' }}>
                  Quote
                </span>
              </div>
              <div className="mb-3">
                <div className="text-[24px] font-bold mb-1" style={{ color: '#1D1D1F' }}>
                  ${message.data.amount}
                </div>
                <p className="text-[14px]" style={{ color: '#6B7280' }}>
                  {message.data.description}
                </p>
              </div>
              <div className="space-y-2">
                <button 
                  className="w-full h-10 bg-blue-50 border border-blue-200 rounded-lg text-[14px] font-medium hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                  style={{ 
                    color: '#007AFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  View Invoice
                </button>
                {currentProgress === 'quoted' && (
                  <button 
                    onClick={() => handleProgressAdvancement('invoice', 'accept')}
                    className="w-full h-10 border border-transparent rounded-lg text-[14px] font-medium transition-colors duration-200 flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#007AFF',
                      color: 'white',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Accept Quote & Schedule
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="w-full max-w-xs">
            <div 
              className="bg-green-50 border border-green-200 rounded-xl p-4"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} color="#059669" />
                <span className="text-[14px] font-medium" style={{ color: '#059669' }}>
                  Payment received ✓
                </span>
              </div>
            </div>
          </div>
        );

      case 'appointment':
        return (
          <div className="w-full max-w-xs">
            <div 
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} color="#007AFF" />
                  <span className="text-[14px] font-medium" style={{ color: '#374151' }}>
                    Appointment
                  </span>
                </div>
                {message.data?.status && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[12px]" style={{ color: '#059669' }}>
                      {message.data.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <div className="text-[16px] font-medium mb-1" style={{ color: '#1D1D1F' }}>
                  {message.data.date}
                </div>
                <div className="text-[14px] mb-1" style={{ color: '#6B7280' }}>
                  {message.data.time}
                </div>
                <div className="text-[14px]" style={{ color: '#6B7280' }}>
                  {message.data.type}
                </div>
              </div>
              {message.data?.status === 'confirmed' && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-[12px]" style={{ color: '#007AFF' }}>
                    💡 The contractor will message you when they arrive
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="w-full max-w-xs">
            <div className="rounded-xl overflow-hidden">
              <ImageWithFallback
                src={message.data.imageUrl}
                alt={message.data.caption || 'Shared image'}
                className="w-full h-40 object-cover"
              />
              {message.data.caption && (
                <div 
                  className="bg-white p-3 text-[14px]"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {message.data.caption}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div 
            className={`max-w-xs px-3 py-2 rounded-2xl ${
              isUser 
                ? 'ml-auto' 
                : 'mr-auto'
            }`}
            style={{
              backgroundColor: isUser ? '#007AFF' : '#F3F4F6',
              color: isUser ? 'white' : '#1D1D1F',
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            {message.content}
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full bg-white flex flex-col max-w-md mx-auto overflow-hidden" 
      style={{ height: hasBottomNav ? 'calc(100vh - 80px)' : '100vh' }}
    >
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={24} color="#1D1D1F" />
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <ImageWithFallback
                  src={vendorAvatar}
                  alt={vendorName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h1 
                  className="text-[18px] font-bold"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {vendorName}
                </h1>
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {vendorService}
                  </span>
                  {isVendorOnline && (
                    <>
                      <span style={{ color: '#D1D5DB' }}>•</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span 
                          className="text-[12px]"
                          style={{ 
                            color: '#059669',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          Available
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={24} color="#007AFF" />
            </motion.button>
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <MoreHorizontal size={20} color="#6B7280" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Progress Tracking Bar */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {[
            { key: 'quoted', label: 'Quoted' },
            { key: 'scheduled', label: 'Scheduled' }, 
            { key: 'completed', label: 'Completed' }
          ].map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div 
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={getProgressStepStyle(step.key)}
                >
                  {(step.key === 'quoted' && currentProgress !== 'quoted') || 
                   (step.key === 'scheduled' && ['completed'].includes(currentProgress)) ? (
                    <CheckCircle size={12} color="white" />
                  ) : null}
                </div>
                <span 
                  className="text-[12px] mt-1"
                  style={{ 
                    color: getProgressStepStyle(step.key).backgroundColor === '#E5E7EB' ? '#9CA3AF' : '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < 2 && (
                <div 
                  className="w-12 h-0.5 mx-2 mt-[-20px]"
                  style={{ 
                    backgroundColor: currentProgress === 'completed' || 
                                   (currentProgress === 'scheduled' && index === 0) ? '#059669' : '#E5E7EB'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={message.sender === 'user' ? 'text-right' : 'text-left'}>
              {renderMessage(message)}
              <div 
                className={`mt-1 text-[12px] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                style={{ 
                  color: '#9CA3AF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Options */}
      <AnimatePresence>
        {showAttachmentOptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-5 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex-shrink-0"
          >
            {[
              { icon: Camera, label: 'Take Photo', action: () => handleFileSelect('camera') },
              { icon: ImageIcon, label: 'Choose Photo', action: () => handleFileSelect('gallery') },
              { icon: FileText, label: 'Attach File', action: () => handleFileSelect('document') },
              ...(currentProgress === 'quoted' ? [
                { icon: DollarSign, label: 'Request Quote', action: () => handleFileSelect('quote') },
                { icon: Calendar, label: 'Schedule Service', action: () => handleFileSelect('schedule') }
              ] : []),
              ...(currentProgress === 'scheduled' ? [
                { icon: CheckCircle, label: 'Mark as Complete', action: () => handleFileSelect('complete') }
              ] : [])
            ].map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
              >
                <option.icon size={20} color="#007AFF" />
                <span 
                  className="text-[16px]"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <div className={`bg-white border-t border-gray-100 px-5 py-4 flex-shrink-0 ${hasBottomNav ? 'pb-4' : 'pb-8'}`}>
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <motion.button
            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 mb-1"
            whileTap={{ scale: 0.95 }}
          >
            <Paperclip size={20} color="#6B7280" />
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 min-h-[44px] max-h-32 bg-gray-50 rounded-2xl px-4 py-2 flex items-center">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-transparent resize-none outline-none text-[16px]"
              style={{
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              messageText.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'
            }`}
            whileTap={messageText.trim() ? { scale: 0.95 } : {}}
          >
            <Send size={16} color="white" />
          </motion.button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx"
        onChange={(e) => {
          // Handle file upload
          console.log('File selected:', e.target.files?.[0]);
        }}
      />
    </div>
  );
}