import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Camera, X, Loader2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/app.store';
import { ConsumerService } from '../services/consumer.service';
import { VendorService } from '../services/vendor.service';
import type { Vendor, CreateRatingRequest } from '../types/api';

interface IntegratedServiceRatingScreenProps {
  onBack: () => void;
  onRatingSubmitted: (rating: any) => void;
  vendorId?: string;
}

interface RatingData {
  costEffectiveness: number;
  qualityOfService: number;
  timelinessOfDelivery: number;
  professionalism: number;
  reviewTitle: string;
  reviewText: string;
  jobDescription: string;
  jobValue: string;
}

export function IntegratedServiceRatingScreen({ 
  onBack, 
  onRatingSubmitted, 
  vendorId 
}: IntegratedServiceRatingScreenProps) {
  const { user } = useAuth();
  const { selectedVendor, isLoading, setLoading, error, setError, clearError } = useAppStore();
  
  const [vendor, setVendor] = useState<Vendor | null>(selectedVendor);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [ratingData, setRatingData] = useState<RatingData>({
    costEffectiveness: 0,
    qualityOfService: 0,
    timelinessOfDelivery: 0,
    professionalism: 0,
    reviewTitle: '',
    reviewText: '',
    jobDescription: '',
    jobValue: '',
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (vendorId && !vendor) {
      loadVendor();
    }
  }, [vendorId, vendor]);

  const loadVendor = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const vendorData = await VendorService.getVendor(vendorId);
      setVendor(vendorData);
    } catch (err: any) {
      setError(err.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category: keyof RatingData, value: number) => {
    setRatingData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleInputChange = (field: keyof RatingData, value: string) => {
    setRatingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateOverallRating = () => {
    const { costEffectiveness, qualityOfService, timelinessOfDelivery, professionalism } = ratingData;
    const total = costEffectiveness + qualityOfService + timelinessOfDelivery + professionalism;
    return total > 0 ? (total / 4).toFixed(1) : '0.0';
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return ratingData.costEffectiveness > 0 && 
               ratingData.qualityOfService > 0 && 
               ratingData.timelinessOfDelivery > 0 && 
               ratingData.professionalism > 0;
      case 2:
        return ratingData.reviewTitle.trim().length > 0;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!vendor) return;

    try {
      setIsSubmitting(true);
      clearError();

      const submitData: CreateRatingRequest = {
        vendorId: vendor.id,
        costEffectiveness: ratingData.costEffectiveness,
        qualityOfService: ratingData.qualityOfService,
        timelinessOfDelivery: ratingData.timelinessOfDelivery,
        professionalism: ratingData.professionalism,
        reviewTitle: ratingData.reviewTitle.trim(),
        reviewText: ratingData.reviewText.trim(),
        jobDescription: ratingData.jobDescription.trim() || undefined,
        jobValue: ratingData.jobValue ? parseFloat(ratingData.jobValue) : undefined,
      };

      const rating = await ConsumerService.createRating(submitData);
      onRatingSubmitted(rating);
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (category: keyof RatingData, label: string, description: string) => {
    const value = ratingData[category] as number;
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{label}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <span className="text-lg font-semibold text-blue-600">
            {value > 0 ? value : '-'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(category, star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= value
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load vendor details for rating.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Rate Service</h1>
        <div className="w-10" />
      </div>

      {/* Progress Indicator */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Rate Categories' :
              currentStep === 2 ? 'Write Review' :
              'Job Details'
            }
          </p>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {vendor.portfolioImages?.[0] ? (
              <ImageWithFallback
                src={vendor.portfolioImages[0]}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {vendor.businessName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{vendor.businessName}</h2>
            <p className="text-gray-600">{vendor.serviceCategories.join(', ')}</p>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {vendor.averageRating.toFixed(1)} ({vendor.totalRatings} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={clearError}
            className="text-red-600 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h2>
              <p className="text-gray-600">Rate each aspect of the service</p>
            </div>

            {renderStarRating('costEffectiveness', 'Cost Effectiveness', 'Value for money and fair pricing')}
            {renderStarRating('qualityOfService', 'Quality of Service', 'Work quality and attention to detail')}
            {renderStarRating('timelinessOfDelivery', 'Timeliness', 'On-time completion and reliability')}
            {renderStarRating('professionalism', 'Professionalism', 'Communication and conduct')}

            {/* Overall Rating Display */}
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {calculateOverallRating()}
                </div>
                <div className="text-sm text-gray-600">Overall Rating</div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Share your experience</h2>
              <p className="text-gray-600">Help others by writing a detailed review</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={ratingData.reviewTitle}
                  onChange={(e) => handleInputChange('reviewTitle', e.target.value)}
                  placeholder="Summarize your experience in one line"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Review
                </label>
                <textarea
                  value={ratingData.reviewText}
                  onChange={(e) => handleInputChange('reviewText', e.target.value)}
                  placeholder="Share details about your experience, what went well, and any areas for improvement..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Details</h2>
              <p className="text-gray-600">Optional information about the completed work</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={ratingData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  placeholder="Describe the work that was completed..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Value ($)
                </label>
                <input
                  type="number"
                  value={ratingData.jobValue}
                  onChange={(e) => handleInputChange('jobValue', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid(currentStep)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                isStepValid(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid(1) || !isStepValid(2)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                !isSubmitting && isStepValid(1) && isStepValid(2)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </div>
              ) : (
                'Submit Rating'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom padding for fixed button */}
      <div className="h-24"></div>
    </div>
  );
}
