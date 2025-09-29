import { useState } from 'react';
import { CheckCircle, ArrowRight, DollarSign, Calendar, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import exampleImage from 'figma:asset/51b3f80e70ee6a415eea5e83fedc3a63892fa869.png';

export function ProgressFlowDemo() {
  const [currentStep, setCurrentStep] = useState<'quoted' | 'scheduled' | 'completed'>('quoted');

  const progressSteps = [
    {
      id: 'quoted',
      label: 'Quoted',
      description: 'Contractor provides quote',
      triggers: ['Customer accepts quote', 'Quote approval', 'Schedule appointment'],
      color: '#007AFF'
    },
    {
      id: 'scheduled',
      label: 'Scheduled', 
      description: 'Service appointment set',
      triggers: ['Service completed', 'Mark as done', 'Upload completion photos'],
      color: '#007AFF'
    },
    {
      id: 'completed',
      label: 'Completed',
      description: 'Service finished',
      triggers: ['Rate service', 'Leave review', 'Book again'],
      color: '#059669'
    }
  ];

  const getStepStyle = (stepId: string) => {
    const steps = ['quoted', 'scheduled', 'completed'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(stepId);
    
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

  const handleAdvanceProgress = () => {
    if (currentStep === 'quoted') {
      setCurrentStep('scheduled');
    } else if (currentStep === 'scheduled') {
      setCurrentStep('completed');
    }
  };

  const handleResetProgress = () => {
    setCurrentStep('quoted');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-[24px] font-bold mb-2 text-center" style={{ color: '#1D1D1F' }}>
          FixRx Progress Flow
        </h1>
        <p className="text-[16px] text-center mb-8" style={{ color: '#6B7280' }}>
          How projects advance from quoted to completed
        </p>

        {/* Current Progress Visual */}
        <div className="mb-8">
          <img 
            src={exampleImage} 
            alt="Progress Steps" 
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>

        {/* Interactive Progress Bar */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-[18px] font-bold mb-4" style={{ color: '#1D1D1F' }}>
            Current Status: {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
          </h3>
          
          <div className="flex items-center justify-between mb-6">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                    style={getStepStyle(step.id)}
                  >
                    {getStepStyle(step.id).backgroundColor !== '#E5E7EB' && (
                      <CheckCircle size={16} color="white" />
                    )}
                  </div>
                  <span 
                    className="text-[12px] mt-2 text-center"
                    style={{ 
                      color: getStepStyle(step.id).backgroundColor === '#E5E7EB' ? '#9CA3AF' : '#374151'
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {index < progressSteps.length - 1 && (
                  <div 
                    className="w-16 h-0.5 mx-3 mt-[-16px]"
                    style={{ 
                      backgroundColor: index === 0 && (currentStep === 'scheduled' || currentStep === 'completed') 
                        ? '#059669' 
                        : index === 1 && currentStep === 'completed'
                        ? '#059669'
                        : '#E5E7EB'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Details */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          {progressSteps.map((step) => (
            step.id === currentStep && (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.id === 'quoted' && <DollarSign size={20} color="white" />}
                    {step.id === 'scheduled' && <Calendar size={20} color="white" />}
                    {step.id === 'completed' && <CheckCircle size={20} color="white" />}
                  </div>
                  <div>
                    <h4 className="text-[18px] font-bold" style={{ color: '#1D1D1F' }}>
                      {step.label}
                    </h4>
                    <p className="text-[14px]" style={{ color: '#6B7280' }}>
                      {step.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-[14px] font-medium mb-2" style={{ color: '#374151' }}>
                    How to advance to next step:
                  </h5>
                  <ul className="space-y-1">
                    {step.triggers.map((trigger, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <ArrowRight size={12} color="#9CA3AF" />
                        <span className="text-[14px]" style={{ color: '#6B7280' }}>
                          {trigger}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStep !== 'completed' && (
            <motion.button
              onClick={handleAdvanceProgress}
              className="w-full h-12 rounded-xl text-[16px] font-medium"
              style={{ backgroundColor: '#007AFF', color: 'white' }}
              whileTap={{ scale: 0.98 }}
            >
              {currentStep === 'quoted' ? 'Accept Quote & Schedule' : 'Mark as Complete'}
            </motion.button>
          )}
          
          <motion.button
            onClick={handleResetProgress}
            className="w-full h-12 rounded-xl border-2 border-gray-200 text-[16px] font-medium"
            style={{ color: '#6B7280' }}
            whileTap={{ scale: 0.98 }}
          >
            Reset to Quoted
          </motion.button>
        </div>

        {/* Flow Explanation */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4">
          <h4 className="text-[16px] font-bold mb-2" style={{ color: '#1E40AF' }}>
            How the Progress Works:
          </h4>
          <div className="space-y-2 text-[14px]" style={{ color: '#1E40AF' }}>
            <p>1. <strong>Quoted:</strong> Contractor sends quote → Customer accepts → Moves to Scheduled</p>
            <p>2. <strong>Scheduled:</strong> Service appointment set → Work completed → Moves to Completed</p>
            <p>3. <strong>Completed:</strong> Service finished → Customer can rate and book again</p>
          </div>
        </div>
      </div>
    </div>
  );
}