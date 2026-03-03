import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  steps: { id: number; name: string; icon: any }[];
  currentStep: number;
}

const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
          <motion.div 
            className="h-full bg-[#ff444f]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-[#ff444f]' :
                  isCurrent ? 'bg-[#ff444f] ring-4 ring-[#ff444f]/20' :
                  'bg-gray-300'
                } text-white`}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
              >
                {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
              </motion.div>
              <span className={`text-xs mt-2 hidden md:block ${
                isCurrent ? 'text-[#ff444f] font-semibold' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;