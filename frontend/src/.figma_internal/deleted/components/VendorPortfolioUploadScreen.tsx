import { useState } from 'react';
import { ArrowLeft, Upload, Camera, ImageIcon, X, Check, ChevronDown, ChevronUp, Star, Eye, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VendorPortfolioUploadScreenProps {
  onBack: () => void;
  onComplete: (portfolioData: any) => void;
  onSkip: () => void;
}

interface UploadedPhoto {
  id: string;
  url: string;
  description: string;
  isFeatured: boolean;
  file: File;
}

interface QualityCheck {
  lighting: boolean;
  focus: boolean;
  angle: boolean;
}

export function VendorPortfolioUploadScreen({ onBack, onComplete, onSkip }: VendorPortfolioUploadScreenProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const MAX_PHOTOS = 6;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Mock quality assessment for uploaded photos
  const assessPhotoQuality = (file: File): QualityCheck => {
    // In a real app, this would use image analysis
    return {
      lighting: Math.random() > 0.3,
      focus: Math.random() > 0.2,
      angle: Math.random() > 0.4
    };
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE) {
        if (uploadedPhotos.length < MAX_PHOTOS) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newPhoto: UploadedPhoto = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              url: e.target?.result as string,
              description: '',
              isFeatured: uploadedPhotos.length === 0, // First photo is featured by default
              file: file
            };
            setUploadedPhotos(prev => [...prev, newPhoto]);
            triggerAutoSave();
          };
          reader.readAsDataURL(file);
        }
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId));
    setEditingPhotoId(null);
    triggerAutoSave();
  };

  const updatePhotoDescription = (photoId: string, description: string) => {
    setUploadedPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, description } : p
    ));
    triggerAutoSave();
  };

  const setFeaturedPhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.map(p => ({
      ...p,
      isFeatured: p.id === photoId
    })));
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  const handleComplete = () => {
    const portfolioData = {
      photos: uploadedPhotos,
      completedAt: new Date().toISOString()
    };
    onComplete(portfolioData);
  };

  const renderQualityIndicator = (quality: QualityCheck) => {
    return (
      <div className="flex items-center space-x-3 mt-3">
        <div className="flex items-center space-x-1">
          {quality.lighting ? (
            <Check size={12} color="#34C759" />
          ) : (
            <X size={12} color="#FF3B30" />
          )}
          <span 
            className="text-[10px]"
            style={{ 
              color: quality.lighting ? '#34C759' : '#FF3B30',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Good lighting
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {quality.focus ? (
            <Check size={12} color="#34C759" />
          ) : (
            <X size={12} color="#FF3B30" />
          )}
          <span 
            className="text-[10px]"
            style={{ 
              color: quality.focus ? '#34C759' : '#FF3B30',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Clear focus
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {quality.angle ? (
            <Check size={12} color="#34C759" />
          ) : (
            <X size={12} color="#FF3B30" />
          )}
          <span 
            className="text-[10px]"
            style={{ 
              color: quality.angle ? '#34C759' : '#FF3B30',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Professional angle
          </span>
        </div>
      </div>
    );
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
            
            <div className="flex-1">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Step 3 of 3
                </span>
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  100%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '66.67%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#007AFF' }}
                />
              </div>
            </div>
          </div>

          {/* Auto-save Indicator */}
          <AnimatePresence>
            {autoSaved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 right-5 flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full"
              >
                <Check size={12} color="#34C759" />
                <span 
                  className="text-[12px]"
                  style={{ 
                    color: '#34C759',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Auto-saved
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title and Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 
              className="text-[28px] font-bold mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Showcase your work
            </h1>
            <p 
              className="text-[16px] mb-3"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Add photos of your best projects
            </p>
            
            {/* Benefits Text */}
            <div className="flex items-center space-x-2">
              <Star size={16} color="#007AFF" />
              <p 
                className="text-[14px] font-medium"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Contractors with portfolios get 5x more contacts
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Photo Counter */}
        {uploadedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 mb-4"
          >
            <p 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {uploadedPhotos.length} of {MAX_PHOTOS} photos
            </p>
          </motion.div>
        )}

        {/* Primary Upload Interface */}
        {uploadedPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <label
              className={`block w-full h-50 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              style={{ borderColor: isDragOver ? '#007AFF' : '#E5E7EB' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="sr-only"
              />
              
              <div className="flex flex-col items-center justify-center h-full p-6">
                <Upload size={48} color="#007AFF" className="mb-4" />
                
                <h3 
                  className="text-[18px] font-medium mb-2 text-center"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Add your best project photo
                </h3>
                
                <p 
                  className="text-[14px] text-center mb-3"
                  style={{ 
                    color: '#9CA3AF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Tap to take photo or choose from gallery
                </p>
                
                <p 
                  className="text-[12px] text-center"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  JPG, PNG up to 10MB each
                </p>
              </div>
            </label>
          </motion.div>
        ) : (
          /* Photo Grid for Multiple Photos */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <div className="grid grid-cols-2 gap-2 mb-6">
              {uploadedPhotos.map((photo, index) => {
                const quality = assessPhotoQuality(photo.file);
                
                return (
                  <div key={photo.id} className="relative">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                      <img 
                        src={photo.url} 
                        alt={`Project photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Featured Badge */}
                      {photo.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center space-x-1 bg-yellow-400 px-2 py-1 rounded-full">
                            <Star size={10} color="white" fill="white" />
                            <span 
                              className="text-[10px] font-medium text-white"
                              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                            >
                              Featured
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Edit Controls Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                        <button
                          onClick={() => setEditingPhotoId(editingPhotoId === photo.id ? null : photo.id)}
                          className="opacity-0 hover:opacity-100 bg-white rounded-full p-2 transition-opacity duration-200"
                        >
                          <Eye size={16} color="#374151" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                      >
                        <X size={12} color="white" />
                      </button>
                    </div>
                    
                    {/* Quality Indicators */}
                    {renderQualityIndicator(quality)}
                  </div>
                );
              })}
            </div>

            {/* Add More Photos Button */}
            {uploadedPhotos.length < MAX_PHOTOS && (
              <label className="block w-full h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer mb-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="sr-only"
                />
                
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Camera size={16} color="#007AFF" />
                    </div>
                    <span 
                      className="text-[16px] font-medium"
                      style={{ 
                        color: '#007AFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Add more photos
                    </span>
                  </div>
                </div>
              </label>
            )}
          </motion.div>
        )}

        {/* Photo Description Section */}
        <AnimatePresence>
          {editingPhotoId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-50 rounded-xl p-4">
                <label 
                  className="block text-[14px] font-medium mb-2"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Describe this project
                  <span 
                    className="text-[12px] font-normal ml-2"
                    style={{ color: '#6B7280' }}
                  >
                    (Optional but recommended)
                  </span>
                </label>
                
                <textarea
                  value={uploadedPhotos.find(p => p.id === editingPhotoId)?.description || ''}
                  onChange={(e) => updatePhotoDescription(editingPhotoId, e.target.value)}
                  className="w-full h-20 p-3 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  style={{
                    backgroundColor: 'white',
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    color: '#1D1D1F'
                  }}
                  placeholder="e.g., Kitchen sink replacement for family of 4..."
                  maxLength={500}
                />
                
                <div className="flex items-center justify-between mt-2">
                  <p 
                    className="text-[12px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {uploadedPhotos.find(p => p.id === editingPhotoId)?.description.length || 0}/500 characters
                  </p>
                  
                  {!uploadedPhotos.find(p => p.id === editingPhotoId)?.isFeatured && (
                    <button
                      onClick={() => setFeaturedPhoto(editingPhotoId)}
                      className="text-[12px] font-medium px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors duration-200"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                    >
                      Set as featured
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portfolio Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2">
              <Lightbulb size={20} color="#007AFF" />
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Tips for great photos
              </span>
            </div>
            {showTips ? (
              <ChevronUp size={20} color="#007AFF" />
            ) : (
              <ChevronDown size={20} color="#007AFF" />
            )}
          </button>

          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 
                    className="text-[14px] font-medium mb-3"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    📸 Photography Guidelines
                  </h4>
                  
                  <div className="space-y-3 text-[12px]" style={{ color: '#6B7280', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                    <p>• Use natural lighting when possible - avoid harsh shadows</p>
                    <p>• Take photos from multiple angles to show the full scope of work</p>
                    <p>• Include before/after shots when available</p>
                    <p>• Keep photos clean and professional looking</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 
                    className="text-[14px] font-medium mb-3"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    🔒 Privacy & Permission
                  </h4>
                  
                  <div className="space-y-3 text-[12px]" style={{ color: '#6B7280', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                    <p>• Always get client permission before taking photos</p>
                    <p>• Blur or crop out faces and personal information</p>
                    <p>• Avoid showing house numbers or identifying features</p>
                    <p>• Focus on your work, not the client's personal space</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          {/* Primary Button */}
          <motion.button
            onClick={handleComplete}
            className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Complete Setup
            </span>
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            onClick={onSkip}
            className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
            style={{ backgroundColor: 'transparent' }}
            whileTap={{ scale: 0.98 }}
          >
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
              }}
            >
              Skip for now
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}