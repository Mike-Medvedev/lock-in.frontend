import { ApiResponse, Commitment, CreateCommitmentRequest, CreateCommitmentResponse } from '../types';

const API_URL = "http://localhost:8000";

// In-memory store for mock commitments (for development)
let mockCommitments: Commitment[] = [
  {
    id: '1',
    title: 'Morning Run Challenge',
    description: 'Running 4x day 2 weeks',
    activity: 'Running',
    duration: '2 weeks',
    frequency: '4x per week',
    stake: 50,
    progress: {
      completed: 5,
      total: 8
    },
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    bonus: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    completedSessions: [],
    weeklyProgress: []
  },
  {
    id: '2',
    title: 'Gym Challenge',
    description: 'Strength training 3x week for 1 month',
    activity: 'Gym',
    duration: '1 month',
    frequency: '3x per week',
    stake: 75,
    progress: {
      completed: 2,
      total: 12
    },
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    bonus: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    completedSessions: [],
    weeklyProgress: []
  }
];

// Fetch all commitments
export const fetchCommitments = async (): Promise<Commitment[]> => {
  try {
    const response = await fetch(`${API_URL}/commitments`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch commitments: ${response.statusText}`);
    }
    
    const result: ApiResponse<Commitment[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching commitments:', error);
    
    // Return mock data for development
    return mockCommitments;
  }
};

// Create a new commitment
export const createCommitment = async (commitmentData: CreateCommitmentRequest): Promise<CreateCommitmentResponse> => {
  try {
    const response = await fetch(`${API_URL}/commitments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commitmentData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create commitment: ${response.statusText}`);
    }
    
    const result: ApiResponse<CreateCommitmentResponse> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating commitment:', error);
    
    // Simulate successful commitment creation with mock data
    const newCommitment: Commitment = {
      id: `commitment_${Date.now()}`,
      title: `${commitmentData.activity} Challenge`,
      description: `${commitmentData.activity} ${commitmentData.frequency} for ${commitmentData.duration}`,
      activity: commitmentData.activity,
      duration: commitmentData.duration,
      frequency: commitmentData.frequency,
      stake: commitmentData.stake,
      progress: {
        completed: 0,
        total: commitmentData.frequency === 'Daily ✅' ? 7 : 
               commitmentData.frequency === '6x per week' ? 6 :
               commitmentData.frequency === '5x per week' ? 5 :
               commitmentData.frequency === '4x per week' ? 4 : 3
      },
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + (commitmentData.duration === '1 Week' ? 7 : 
                                     commitmentData.duration === '2 Weeks' ? 14 :
                                     commitmentData.duration === '3 Weeks' ? 21 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      bonus: commitmentData.stake >= 100 ? 20 : commitmentData.stake >= 50 ? 10 : 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedSessions: [],
      weeklyProgress: []
    };

    // Add the new commitment to our mock store
    mockCommitments.push(newCommitment);

    const mockResponse: CreateCommitmentResponse = {
      commitment: newCommitment,
      paymentIntent: `pi_mock_${Date.now()}`
    };

    return mockResponse;
  }
};

// Update commitment progress
export const updateCommitmentProgress = async (commitmentId: string, progress: { completed: number; total: number }): Promise<Commitment> => {
  try {
    const response = await fetch(`${API_URL}/commitments/${commitmentId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update commitment progress: ${response.statusText}`);
    }
    
    const result: ApiResponse<Commitment> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating commitment progress:', error);
    throw error;
  }
};
