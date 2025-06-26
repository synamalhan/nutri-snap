export const API_BASE_URL = 'http://localhost:8000';

export const HEALTH_RATINGS = {
  HEALTHY: '🟢 Healthy',
  MODERATE: '🟡 Moderate', 
  UNHEALTHY: '🔴 Unhealthy'
} as const;

export const NUTRITION_THRESHOLDS = {
  CALORIES_HIGH: 600,
  CALORIES_MODERATE: 400,
  FAT_HIGH: 25,
  FAT_MODERATE: 15,
  SUGAR_HIGH: 20,
  SUGAR_MODERATE: 10
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];