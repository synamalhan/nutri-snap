export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: number;
}

export interface NutritionTotal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalysisResult {
  items: FoodItem[];
  total: NutritionTotal;
  healthRating: string;
  processingTime?: number;
}

export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}