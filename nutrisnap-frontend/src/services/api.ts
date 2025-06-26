import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { AnalysisResult, ApiResponse } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI processing
});

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse>('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Analysis failed');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again');
      }
      if (error.response?.status === 404) {
        throw new Error('Backend service not available. Please make sure the server is running.');
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    
    throw new Error('Network error - please check your connection and try again');
  }
};

// Mock function for development/testing
export const mockAnalyzeImage = async (file: File): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    items: [
      {
        name: 'grilled chicken breast',
        calories: 185,
        protein: 35,
        carbs: 0,
        fat: 4,
        confidence: 0.95
      },
      {
        name: 'brown rice',
        calories: 220,
        protein: 5,
        carbs: 45,
        fat: 2,
        confidence: 0.88
      },
      {
        name: 'steamed broccoli',
        calories: 25,
        protein: 3,
        carbs: 5,
        fat: 0,
        confidence: 0.92
      }
    ],
    total: {
      calories: 430,
      protein: 43,
      carbs: 50,
      fat: 6
    },
    healthRating: '🟢 Healthy',
    processingTime: 2.3
  };
};