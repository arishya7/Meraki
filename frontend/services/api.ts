import { ScootUserData, UserDataInputRequest, Recommendation, ChatbotResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const postUserInputData = async (data: UserDataInputRequest): Promise<ScootUserData> => {
  const response = await fetch(`${API_BASE_URL}/user/input_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to process user input');
  }

  return response.json();
};

export const postRecommendations = async (userData: ScootUserData): Promise<ChatbotResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/recommend_plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get recommendations');
  }

  return response.json();
};

export const getUserProfile = async (nric: string): Promise<ScootUserData> => {
  const response = await fetch(`${API_BASE_URL}/user/profile/${nric}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user profile');
  }

  return response.json();
};

export const getFlightSummary = async (nric: string): Promise<ScootUserData> => {
  const response = await fetch(`${API_BASE_URL}/flights/summary/${nric}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch flight summary');
  }

  return response.json();
};
