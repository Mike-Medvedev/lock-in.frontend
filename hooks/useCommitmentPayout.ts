import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayout } from '../api/payouts';
import { calculatePayout } from '../business-rules/commitmentRules';
import { Commitment } from '../types';

interface PayoutData {
  commitment: Commitment;
  customerId?: string;
  bankAccountId?: string;
}

interface PayoutResult {
  success: boolean;
  payoutId?: string;
  amount: number;
  transactionId?: string;
  error?: string;
}

// Hook to process payout for a completed commitment
export const useProcessCommitmentPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commitment, customerId, bankAccountId }: PayoutData): Promise<PayoutResult> => {
      try {
        // Calculate payout amount (stake + bonus)
        const payoutAmount = calculatePayout(commitment);
        const amountInCents = Math.round(payoutAmount * 100); // Convert to cents

        // Create payout request
        const payoutRequest = {
          commitmentId: commitment.id,
          amount: amountInCents,
          currency: 'usd',
          description: `Commitment completion payout: ${commitment.title}`,
          customerId,
          bankAccountId,
        };

        // Process payout
        const payoutResponse = await createPayout(payoutRequest);

        if (!payoutResponse.success) {
          throw new Error(payoutResponse.error || 'Failed to process payout');
        }

        return {
          success: true,
          payoutId: payoutResponse.payoutId,
          amount: payoutAmount,
          transactionId: payoutResponse.transactionId,
        };
      } catch (error) {
        console.error('Error processing commitment payout:', error);
        return {
          success: false,
          amount: 0,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
    onSuccess: (result, { commitment }) => {
      if (result.success) {
        // Update commitment status to completed with payout
        queryClient.setQueryData(
          ['commitments', commitment.id],
          (oldCommitment: Commitment | undefined) => {
            if (!oldCommitment) return oldCommitment;
            
            return {
              ...oldCommitment,
              status: 'completed' as const,
              payoutStatus: 'completed' as const,
            };
          }
        );

        // Invalidate commitment list to show updated status
        queryClient.invalidateQueries({ queryKey: ['commitments'] });
      }
    },
    onError: (error) => {
      console.error('Failed to process commitment payout:', error);
    },
  });
};

// Hook to handle the complete payout flow
export const useCommitmentPayoutFlow = () => {
  const processPayout = useProcessCommitmentPayout();

  const executePayout = async (commitment: Commitment): Promise<{
    success: boolean;
    amount?: number;
    transactionId?: string;
    error?: string;
  }> => {
    try {
      // For now, we'll use mock customer data
      // In production, this would come from user's stored payment methods
      const mockCustomerData = {
        customerId: `cus_mock_${commitment.id}`,
        bankAccountId: `ba_mock_${commitment.id}`,
      };

      const result = await processPayout.mutateAsync({
        commitment,
        ...mockCustomerData,
      });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  return {
    executePayout,
    isProcessing: processPayout.isPending,
    error: processPayout.error,
  };
};
