import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Search } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  const loadingSteps = [
    { icon: Search, text: 'Analyzing image...', delay: 0 },
    { icon: Brain, text: 'Detecting food items...', delay: 1 },
    { icon: Zap, text: 'Calculating nutrition...', delay: 2 },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
      >
        <div className="text-center mb-6">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <motion.div
              className="absolute inset-0 border-4 border-emerald-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-emerald-500 rounded-full border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI Analysis in Progress
          </h3>
          <p className="text-sm text-gray-500">
            This may take a few moments...
          </p>
        </div>

        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay * 0.5 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50"
            >
              <div className="flex-shrink-0">
                <step.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">{step.text}</span>
              <div className="flex-grow flex justify-end">
                <motion.div
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: step.delay * 0.5 + 0.5
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Brain className="h-4 w-4 text-emerald-600" />
            <span>Powered by Advanced AI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;