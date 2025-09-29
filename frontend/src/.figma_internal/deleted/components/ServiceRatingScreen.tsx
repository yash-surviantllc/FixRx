import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, ImageIcon, Upload, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServiceRatingScreenProps {
  onBack: () => void;
  onSubmitReview: (reviewData: any) => void;
  onSkipReview: () => void;
  serviceName: string;
  vendorName: string;
  completionDate: string;
}

interface RatingCategory {
  id: string;
  label: string;
  value: number;
  leftEmoji: string;
  rightEmoji: string;
  leftColor: string;
  rightColor: string;
}

interface UploadedPhoto {
  id: string;
  url: string;
  file: File;
}

export function ServiceRatingScreen({ 
  onBack, 
  onSubmitReview, 
  onSkipReview, 
  serviceName, 
  vendorName, 
  completionDate 
}: ServiceRatingScreenProps) {
  const [ratings, setRatings] = useState<RatingCategory[]>([
    {
      id: 'quality',
      label: 'Quality of Work',
      value: 0,
      leftEmoji: '😞',
      rightEmoji: '😍',
      leftColor: '#DC2626',
      rightColor: '#059669'
    },
    {
      id: 'communication',
      label: 'Communication',
      value: 0,
      leftEmoji: '😕',
      rightEmoji: '💬',
      leftColor: '#DC2626',
      rightColor: '#059669'
    },
    {
      id: 'timeliness',
      label: 'Timeliness',
      value: 0,
      leftEmoji: '⏰',
      rightEmoji: '⚡',
      leftColor: '#DC2626',
      rightColor: '#059669'
    },
    {
      id: 'professionalism',
      label: 'Professionalism',
      value: 0,
      leftEmoji: '💼',
      rightEmoji: '✨',
      leftColor: '#DC2626',
      rightColor: '#059669'
    }
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheckAnimation, setShowCheckAnimation] = useState(false);

  const handleRatingChange = (categoryId: string, value: number) => {
    setRatings(prev => prev.map(rating => 
      rating.id === categoryId ? { ...rating, value } : rating
    ));
    
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && uploadedPhotos.length < 5) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: UploadedPhoto = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            file: file
          };
          setUploadedPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const calculateOverallRating = () => {
    const nonZeroRatings = ratings.filter(r => r.value > 0);
    if (nonZeroRatings.length === 0) return 0;
    
    const total = nonZeroRatings.reduce((sum, rating) => sum + rating.value, 0);
    return Math.round((total / nonZeroRatings.length) * 10) / 10;
  };

  const isFormValid = () => {
    return ratings.some(rating => rating.value > 0);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reviewData = {
      ratings: ratings.reduce((acc, rating) => {
        if (rating.value > 0) {
          acc[rating.id] = rating.value;
        }
        return acc;
      }, {} as Record<string, number>),
      overallRating: calculateOverallRating(),
      photos: uploadedPhotos,
      reviewText: reviewText.trim(),
      serviceName,
      vendorName,
      completionDate,
      submittedAt: new Date().toISOString()
    };

    setIsSubmitting(false);
    setShowCheckAnimation(true);
    
    setTimeout(() => {
      onSubmitReview(reviewData);
    }, 1000);
  };

  const getSliderGradient = (category: RatingCategory) => {
    return `linear-gradient(90deg, ${category.leftColor} 0%, #FEF3C7 50%, ${category.rightColor} 100%)`;
  };

  const getThumbPosition = (value: number) => {
    return `${(value / 5) * 100}%`;
  };

  const getRatingEmoji = (category: RatingCategory) => {
    if (category.value === 0) return '😐';
    if (category.value <= 1.5) return category.leftEmoji;
    if (category.value <= 2.5) return '😐';
    if (category.value <= 3.5) return '🙂';
    if (category.value <= 4.5) return '😊';
    return category.rightEmoji;
  };

  useEffect(() => {
    setShowCheckAnimation(true);
    setTimeout(() => setShowCheckAnimation(false), 800);
  }, []);

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
              {/* Service Completion Confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 mb-2"
              >
                <span 
                  className="text-[18px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Service Completed
                </span>
                
                <AnimatePresence>
                  {showCheckAnimation && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                    >
                      <Check size={20} color="#34C759" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Service Details */}
              <p 
                className="text-[18px] font-medium mb-1"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {serviceName} with {vendorName}
              </p>
              
              <p 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Completed on {completionDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Rating Interface Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8 mb-8"
        >
          <h1 
            className="text-[24px] font-bold mb-3"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            How was your experience?
          </h1>
          
          <p 
            className="text-[16px]"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Your honest feedback helps our community
          </p>
        </motion.div>

        {/* Mood Slider Rating System */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6 mb-8"
        >
          {ratings.map((category, index) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <label 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {category.label}
                </label>
                
                {category.value > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-[20px]">{getRatingEmoji(category)}</span>
                    <span 
                      className="text-[16px] font-medium"
                      style={{ 
                        color: '#007AFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {category.value.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Custom Slider */}
              <div className="relative">
                <div 
                  className="w-full h-12 rounded-xl relative overflow-hidden border border-gray-200"
                  style={{ background: getSliderGradient(category) }}
                >
                  {/* Emoji Indicators */}
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[20px] z-10">
                    {category.leftEmoji}
                  </div>
                  
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[20px] z-10">
                    {category.rightEmoji}
                  </div>
                  
                  {/* Interactive Slider */}
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={category.value}
                    onChange={(e) => handleRatingChange(category.id, parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  
                  {/* Custom Thumb */}
                  {category.value > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-blue-500 z-30 flex items-center justify-center"
                      style={{ left: getThumbPosition(category.value) }}
                    >
                      <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Overall Rating Display */}
        {calculateOverallRating() > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
          >
            <h3 
              className="text-[18px] font-bold"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Overall: {calculateOverallRating()}/5.0
            </h3>
          </motion.div>
        )}

        {/* Photo Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h3 
            className="text-[16px] font-medium mb-4"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Share photos of completed work{' '}
            <span 
              className="text-[14px] font-normal"
              style={{ color: '#6B7280' }}
            >
              (Optional)
            </span>
          </h3>

          {uploadedPhotos.length === 0 ? (
            <label className="block w-full h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="sr-only"
              />
              
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Camera size={24} color="#6B7280" />
                  <ImageIcon size={24} color="#6B7280" />
                </div>
                
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Add photos
                </span>
              </div>
            </label>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {uploadedPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square">
                    <img 
                      src={photo.url} 
                      alt="Completed work"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                    >
                      <X size={12} color="white" />
                    </button>
                  </div>
                ))}
              </div>
              
              {uploadedPhotos.length < 5 && (
                <label className="block w-full h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="sr-only"
                  />
                  
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center space-x-2">
                      <Upload size={16} color="#007AFF" />
                      <span 
                        className="text-[14px] font-medium"
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
            </div>
          )}
        </motion.div>

        {/* Written Review */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <label 
            className="block text-[16px] font-medium mb-4"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Tell others about your experience{' '}
            <span 
              className="text-[14px] font-normal"
              style={{ color: '#6B7280' }}
            >
              (Optional but encouraged)
            </span>
          </label>
          
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full h-25 p-4 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            style={{
              backgroundColor: 'white',
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
              color: '#1D1D1F'
            }}
            placeholder="Describe the service, quality, and your overall satisfaction..."
            maxLength={500}
          />
          
          <div className="flex items-center justify-between mt-2">
            <p 
              className="text-[14px]"
              style={{ 
                color: '#9CA3AF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {reviewText.length}/500 characters
            </p>
            
            {reviewText.length > 0 && (
              <p 
                className="text-[12px]"
                style={{ 
                  color: '#34C759',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Great! Detailed reviews help other customers
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Fixed Submit Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          {/* Primary Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className={`w-full h-14 rounded-xl transition-all duration-200 flex items-center justify-center ${
              isFormValid() && !isSubmitting
                ? 'hover:opacity-90 active:scale-[0.98]' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              background: isFormValid() && !isSubmitting
                ? 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' 
                : '#E5E7EB',
              boxShadow: isFormValid() && !isSubmitting
                ? '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)' 
                : 'none'
            }}
            whileTap={isFormValid() && !isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span 
                  className="text-white text-[16px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Submitting...
                </span>
              </div>
            ) : (
              <span 
                className="text-white text-[16px] font-medium text-center"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Submit Review
              </span>
            )}
          </motion.button>

          {/* Secondary Skip Button */}
          <motion.button
            onClick={onSkipReview}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 transition-colors duration-200 hover:bg-gray-50 rounded-lg"
            whileTap={{ scale: 0.98 }}
          >
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
              }}
            >
              Skip review
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}