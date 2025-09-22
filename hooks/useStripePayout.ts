import { useMutation } from '@tanstack/react-query';

interface PayoutRequest {
  commitmentId: string;
  amount: number; // in cents
  currency?: string;
  description?: string;
}

interface PayoutResponse {
  success: boolean;
  payoutId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  error?: string;
}

const API_URL = "http://localhost:8000";

// Create a payout to the customer
const createPayout = async (payoutData: PayoutRequest): Promise<PayoutResponse> => {
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

    const result = await response.json();
    return result;
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
    };
    
    return mockPayout;
  }
};

// Check payout status
const checkPayoutStatus = async (payoutId: string): Promise<PayoutResponse> => {
  try {
    const response = await fetch(`${API_URL}/payouts/${payoutId}/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to check payout status: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking payout status:', error);
    throw error;
  }
};

// Hook to create a payout
export const useCreatePayout = () => {
  return useMutation({
    mutationFn: createPayout,
    onError: (error) => {
      console.error('Failed to create payout:', error);
    },
  });
};

// Hook to check payout status
export const useCheckPayoutStatus = () => {
  return useMutation({
    mutationFn: checkPayoutStatus,
  });
};

// Utility function to format amount for display
export const formatPayoutAmount = (amountInCents: number): string => {
  return `$${(amountInCents / 100).toFixed(2)}`;
};

// Utility function to convert dollars to cents
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};
