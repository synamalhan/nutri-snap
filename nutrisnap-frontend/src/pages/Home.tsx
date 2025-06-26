import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UploadImage from '../components/UploadImage';
import ResultsCard from '../components/ResultsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeImage } from '../services/api';
import { AnalysisResult } from '../types';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(file);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover What's in Your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Food
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload a photo of your meal and get instant AI-powered nutrition analysis, 
              including calories, macronutrients, and personalized health insights.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-12">
              <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>AI Food Detection</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Instant Nutrition Analysis</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Health Rating System</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex justify-center">
          {isLoading ? (
            <LoadingSpinner />
          ) : result ? (
            <div className="w-full">
              <ResultsCard result={result} />
              <div className="text-center mt-8">
                <button
                  onClick={handleNewAnalysis}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Analyze Another Meal
                </button>
              </div>
            </div>
          ) : (
            <UploadImage onImageUpload={handleImageUpload} isLoading={isLoading} />
          )}
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleNewAnalysis}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How NutriSnap Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our advanced AI technology makes nutrition tracking effortless and accurate
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/50 rounded-2xl">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Upload Photo</h3>
                <p className="text-gray-600">Take a photo of your meal or upload from your device</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-2xl">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-gray-600">Our AI identifies food items and calculates nutrition</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-2xl">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Insights</h3>
                <p className="text-gray-600">Receive detailed nutrition breakdown and health rating</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;