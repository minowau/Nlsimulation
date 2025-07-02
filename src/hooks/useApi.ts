import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Resource, LearnerProgress, Position, SuggestedPath, GridSize } from '../types';

// Use the same protocol as the current page to avoid mixed content issues
const getApiBaseUrl = () => {
  const protocol = window.location.protocol;
  const isHttps = protocol === 'https:';
  
  // If we're on HTTPS, we need to use HTTPS for the API as well
  // For development, we'll use the same protocol as the frontend
  if (isHttps) {
    // In production, you'd want to use your HTTPS API endpoint
    // For now, we'll warn the user about the mixed content issue
    console.warn('HTTPS detected - API calls may fail due to mixed content policy. Please access the app via HTTP (http://localhost:5173) for development.');
  }
  
  return `${protocol}//localhost:3001/api`;
};

const API_BASE_URL = getApiBaseUrl();

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const apiCall = async <T>(
    request: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    setLoading(true);
    try {
      const result = await request();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      console.error('API Error:', error);
      
      // Provide more specific error messaging for mixed content issues
      if (axios.isAxiosError(error) && error.message === 'Network Error') {
        const isHttps = window.location.protocol === 'https:';
        if (isHttps) {
          toast.error('Mixed content error: Please access the app via HTTP (http://localhost:5173) instead of HTTPS');
        } else {
          toast.error('Network error: Please ensure the backend server is running on http://localhost:3001');
        }
      } else {
        toast.error(errorMessage || 'An error occurred');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async (): Promise<{ resources: Resource[]; gridSize: GridSize }> => {
    return apiCall(
      async () => {
        const response = await axios.get(`${API_BASE_URL}/resources`);
        return response.data;
      }
    );
  };

  const fetchProgress = async (): Promise<LearnerProgress> => {
    return apiCall(
      async () => {
        const response = await axios.get(`${API_BASE_URL}/learner-progress`);
        return response.data;
      }
    );
  };

  const completeResource = async (resourceName: string, position: Position): Promise<void> => {
    return apiCall(
      async () => {
        await axios.post(`${API_BASE_URL}/complete`, {
          resourceName,
          position
        });
      },
      '🎉 Resource completed! Great job!',
      'Failed to complete resource'
    );
  };

  const getSuggestedPath = async (currentPosition: Position): Promise<SuggestedPath> => {
    return apiCall(
      async () => {
        const response = await axios.post(`${API_BASE_URL}/suggest-path`, {
          currentPosition
        });
        return response.data;
      },
      '🤖 AI has suggested an optimal learning path!',
      'Failed to generate learning path'
    );
  };

  const resetProgress = async (): Promise<void> => {
    return apiCall(
      async () => {
        await axios.post(`${API_BASE_URL}/reset-progress`);
      },
      'Progress reset successfully',
      'Failed to reset progress'
    );
  };

  return {
    loading,
    fetchResources,
    fetchProgress,
    completeResource,
    getSuggestedPath,
    resetProgress
  };
};