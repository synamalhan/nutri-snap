import React from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Zap, 
  Activity, 
  TrendingUp, 
  Info,
  Heart,
  Scale,
  Timer
} from 'lucide-react';
import { AnalysisResult, FoodItem } from '../types';

interface ResultsCardProps {
  result: AnalysisResult;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result }) => {
  const getHealthRatingColor = (rating: string) => {
    if (rating.includes('🟢')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (rating.includes('🟡')) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getHealthRatingIcon = (rating: string) => {
    if (rating.includes('🟢')) return <Heart className="h-4 w-4" />;
    if (rating.includes('🟡')) return <Activity className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Health Rating Card */}
      <div className={`p-6 rounded-2xl border-2 ${getHealthRatingColor(result.healthRating)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getHealthRatingIcon(result.healthRating)}
            <div>
              <h3 className="text-xl font-bold">Overall Health Rating</h3>
              <p className="text-sm opacity-80">Based on nutritional analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{result.healthRating}</div>
            {result.processingTime && (
              <div className="text-xs opacity-60 flex items-center mt-1">
                <Timer className="h-3 w-3 mr-1" />
                {result.processingTime}s
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Scale className="h-5 w-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-900">Nutrition Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Calories</span>
            </div>
            <div className="text-2xl font-bold text-emerald-900">{result.total.calories}</div>
            <div className="text-xs text-emerald-600">kcal</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Protein</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{result.total.protein}g</div>
            <div className="text-xs text-blue-600">{Math.round((result.total.protein * 4 / result.total.calories) * 100)}% of calories</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-amber-900">{result.total.carbs}g</div>
            <div className="text-xs text-amber-600">{Math.round((result.total.carbs * 4 / result.total.calories) * 100)}% of calories</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Fat</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{result.total.fat}g</div>
            <div className="text-xs text-purple-600">{Math.round((result.total.fat * 9 / result.total.calories) * 100)}% of calories</div>
          </div>
        </div>
      </div>

      {/* Food Items Detected */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Utensils className="h-5 w-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-900">Detected Food Items</h3>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
            {result.items.length} items
          </span>
        </div>
        
        <div className="space-y-4">
          {result.items.map((item: FoodItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 capitalize text-lg">
                    {item.name}
                  </h4>
                  {item.confidence && (
                    <p className="text-sm text-gray-500">
                      Confidence: {Math.round(item.confidence * 100)}%
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.calories}</div>
                    <div className="text-xs text-gray-500">cal</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-600">{item.protein}g</div>
                    <div className="text-xs text-gray-500">protein</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-amber-600">{item.carbs}g</div>
                    <div className="text-xs text-gray-500">carbs</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600">{item.fat}g</div>
                    <div className="text-xs text-gray-500">fat</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsCard;