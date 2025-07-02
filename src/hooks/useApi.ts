import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Resource, LearnerProgress, Position, SuggestedPath, GridSize } from '../types';

// Use the same protocol as the current page to avoid mixed content issues
const API_BASE_URL = 'http://localhost:3001/api';

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
      
      toast.error(errorMessage || 'An error occurred');
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