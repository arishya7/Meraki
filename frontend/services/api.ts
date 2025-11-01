import { ScootUserData, UserDataInputRequest, Recommendation, ChatbotResponse, FlightSummaryResponse } from '../types';

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

export const getFlightSummary = async (nric: string): Promise<FlightSummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/flights/summary/${nric}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch flight summary');
  }

  return response.json();
};

// Authentication APIs
export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    nric: string;
    allows_tracking?: boolean;
  };
  token?: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      message: errorData.detail || 'Login failed',
    };
  }

  return response.json();
};

export const signUpUser = async (
  name: string,
  email: string,
  password: string,
  nric: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, nric }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        return {
          success: false,
          message: `Sign up failed: ${response.statusText || 'Server error'}`,
        };
      }
      return {
        success: false,
        message: errorData.detail || errorData.message || 'Sign up failed',
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Network error or fetch failed
    console.error('Signup fetch error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to server. Please check your connection.',
    };
  }
};

export const loginWithSingpass = async (): Promise<LoginResponse> => {
  // Simulate Singpass OAuth flow
  // In a real implementation, this would redirect to Singpass and handle the callback
  const response = await fetch(`${API_BASE_URL}/auth/singpass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      message: errorData.detail || 'Singpass login failed',
    };
  }

  return response.json();
};

export const getUserTrackingStatus = async (userId: string): Promise<{ allows_tracking: boolean }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/auth/tracking-status/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tracking status');
  }

  return response.json();
};

export const getRecentActivity = async (userId: string): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/auth/recent-activity/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recent activity');
  }

  return response.json();
};

export const updateLocationTracking = async (
  userId: string,
  allowsTracking: boolean
): Promise<{ success: boolean; message: string; allows_tracking: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/auth/update-tracking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      allows_tracking: allowsTracking,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update tracking preference');
  }

  return response.json();
};

export const askQuestion = async (
  question: string,
  context?: string
): Promise<{ answer: string; success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/chat/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      context,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get answer');
  }

  return response.json();
};
