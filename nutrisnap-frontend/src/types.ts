export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: number;
  /** Normalized [x1, y1, x2, y2] in 0..1 image coordinates. */
  box?: [number, number, number, number] | null;
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

export type Goals = NutritionTotal;

export interface MealEntry {
  id: string;
  date: string; // ISO timestamp
  names: string[];
  total: NutritionTotal;
  thumbnail?: string; // small JPEG data URL
}
