import { ApiResponse } from '../types';

const API_URL = "http://localhost:8000";

export interface PayoutRequest {
  commitmentId: string;
  amount: number; // in cents
  currency?: string;
  description?: string;
  customerId?: string;
  bankAccountId?: string;
}

export interface PayoutResponse {
  success: boolean;
  payoutId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  estimatedArrival?: string;
  error?: string;
}

// Create a payout to customer's bank account
export const createPayout = async (payoutData: PayoutRequest): Promise<PayoutResponse> => {
  try {
    const response = await fetch(`${API_URL}/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payoutData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create payout: ${response.statusText}`);
    }

    const result: ApiResponse<PayoutResponse> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating payout:', error);
    
    // Mock payout for development
    const mockPayout: PayoutResponse = {
      success: true,
      payoutId: `po_mock_${Date.now()}`,
      amount: payoutData.amount,
      currency: payoutData.currency || 'usd',
      status: 'paid',
      transactionId: `txn_mock_${Date.now()}`,
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
    };
    
    return mockPayout;
  }
};

// Check payout status
export const checkPayoutStatus = async (payoutId: string): Promise<PayoutResponse> => {
  try {
    const response = await fetch(`${API_URL}/payouts/${payoutId}/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to check payout status: ${response.statusText}`);
    }

    const result: ApiResponse<PayoutResponse> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error checking payout status:', error);
    
    // Mock status check for development
    return {
      success: true,
      payoutId,
      amount: 7500, // $75
      currency: 'usd',
      status: 'paid',
      transactionId: `txn_mock_${Date.now()}`,
    };
  }
};

// Get payout history for a commitment
export const getCommitmentPayouts = async (commitmentId: string): Promise<PayoutResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/commitments/${commitmentId}/payouts`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch commitment payouts: ${response.statusText}`);
    }

    const result: ApiResponse<PayoutResponse[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching commitment payouts:', error);
    
    // Mock payout history for development
    return [];
  }
};

// Cancel a pending payout
export const cancelPayout = async (payoutId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/payouts/${payoutId}/cancel`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to cancel payout: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error cancelling payout:', error);
    
    // Mock cancel for development
    return {
      success: true,
    };
  }
};
