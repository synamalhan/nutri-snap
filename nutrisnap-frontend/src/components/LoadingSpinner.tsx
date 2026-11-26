import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-md mx-auto"
    role="status"
    aria-live="polite"
  >
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      <img src={imageUrl} alt="Meal being analyzed" className="w-full aspect-square object-cover" />
      <div className="absolute inset-0 bg-emerald-900/20" />
      {/* Scanning line */}
      <motion.div
        className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-emerald-300/50 to-transparent"
        animate={{ top: ['-25%', '100%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-800 shadow">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
        Detecting food items…
      </div>
    </div>
  </motion.div>
);

export default LoadingSpinner;
