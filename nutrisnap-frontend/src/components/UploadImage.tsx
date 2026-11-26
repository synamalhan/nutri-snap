import React, { useState, useRef } from 'react';
import { ImagePlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '../constants';

interface UploadImageProps {
  onImageUpload: (file: File) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
    } else if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
    } else {
      setError(null);
      onImageUpload(file);
    }
  };

  const openPicker = () => fileInputRef.current?.click();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a meal photo"
        onClick={openPicker}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openPicker())}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`cursor-pointer rounded-3xl border-2 border-dashed bg-white/80 backdrop-blur p-10 md:p-14 text-center shadow-xl shadow-emerald-900/5 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 ${
          isDragOver ? 'border-emerald-500 bg-emerald-50 scale-[1.01]' : 'border-gray-200 hover:border-emerald-400'
        }`}
      >
        <div className={`mx-auto mb-5 w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
          isDragOver ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <ImagePlus className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {isDragOver ? 'Drop it here' : 'Upload your meal photo'}
        </h3>
        <p className="text-gray-500 mb-6">Drag and drop an image, or click to browse</p>
        <span className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-600/20 transition-colors">
          Choose image
        </span>
        <p className="mt-6 text-xs text-gray-400">JPEG, PNG or WebP · up to 10MB</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(',')}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
          e.target.value = ''; // allow re-selecting the same file
        }}
        className="hidden"
      />
    </motion.div>
  );
};

export default UploadImage;
