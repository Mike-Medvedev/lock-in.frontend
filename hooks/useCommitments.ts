import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCommitment, fetchCommitments, updateCommitmentProgress } from '../api/commitments';

// Query key factory
export const commitmentKeys = {
  all: ['commitments'] as const,
  lists: () => [...commitmentKeys.all, 'list'] as const,
  list: (filters: string) => [...commitmentKeys.lists(), { filters }] as const,
  details: () => [...commitmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commitmentKeys.details(), id] as const,
};

// Hook to fetch all commitments
export const useCommitments = () => {
  return useQuery({
    queryKey: commitmentKeys.lists(),
    queryFn: fetchCommitments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to create a new commitment
export const useCreateCommitment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCommitment,
    onSuccess: () => {
      // Invalidate and refetch commitments list
      queryClient.invalidateQueries({ queryKey: commitmentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create commitment:', error);
    },
  });
};

// Hook to update commitment progress
export const useUpdateCommitmentProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commitmentId, progress }: { commitmentId: string; progress: { completed: number; total: number } }) =>
      updateCommitmentProgress(commitmentId, progress),
    onSuccess: (updatedCommitment) => {
      // Update the specific commitment in cache
      queryClient.setQueryData(commitmentKeys.detail(updatedCommitment.id), updatedCommitment);
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: commitmentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update commitment progress:', error);
    },
  });
};
