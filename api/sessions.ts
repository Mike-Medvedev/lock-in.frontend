import { canRecordSession } from '../business-rules/commitmentRules';
import { ApiResponse, Commitment, Session } from '../types';

const API_URL = "http://localhost:8000";

// Record a new session
export const recordSession = async (sessionData: {
  commitmentId: string;
  date: string;
  duration: number;
  distance?: number;
  heartRate?: number;
}): Promise<Session> => {
  try {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record session: ${response.statusText}`);
    }
    
    const result: ApiResponse<Session> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error recording session:', error);
    
    // Mock session creation for development
    const mockSession: Session = {
      id: `session_${Date.now()}`,
      commitmentId: sessionData.commitmentId,
      date: sessionData.date,
      duration: sessionData.duration,
      distance: sessionData.distance,
      heartRate: sessionData.heartRate,
      verified: true,
      createdAt: new Date().toISOString(),
    };
    
    return mockSession;
  }
};

// Get sessions for a commitment
export const getCommitmentSessions = async (commitmentId: string): Promise<Session[]> => {
  try {
    const response = await fetch(`${API_URL}/commitments/${commitmentId}/sessions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }
    
    const result: ApiResponse<Session[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    
    // Return mock sessions for development
    const mockSessions: Session[] = [
      {
        id: 'session_1',
        commitmentId,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 32,
        distance: 5.2,
        heartRate: 145,
        verified: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'session_2',
        commitmentId,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 28,
        distance: 4.8,
        heartRate: 142,
        verified: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    
    return mockSessions;
  }
};

// Evaluate commitment status and update if needed
export const evaluateCommitment = async (commitmentId: string): Promise<Commitment> => {
  try {
    const response = await fetch(`${API_URL}/commitments/${commitmentId}/evaluate`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to evaluate commitment: ${response.statusText}`);
    }
    
    const result: ApiResponse<Commitment> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error evaluating commitment:', error);
    throw error;
  }
};

// Process payout for completed commitment
export const processPayout = async (commitmentId: string): Promise<{
  success: boolean;
  amount: number;
  transactionId?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/commitments/${commitmentId}/payout`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process payout: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error processing payout:', error);
    
    // Mock payout for development
    return {
      success: true,
      amount: 75, // $50 stake + $25 bonus
      transactionId: `txn_mock_${Date.now()}`
    };
  }
};

// Check if user can record a session today
export const canRecordSessionToday = (commitmentId: string, existingSessions: Session[]): boolean => {
  const today = new Date();
  const sessionDates = existingSessions.map(s => new Date(s.date));
  return canRecordSession(today, sessionDates);
};
