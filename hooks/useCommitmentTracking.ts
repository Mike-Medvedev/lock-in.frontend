import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    canRecordSessionToday,
    getCommitmentSessions,
    processPayout,
    recordSession
} from '../api/sessions';
import {
    calculateWeeklyRequirements,
    CommitmentProgress,
    evaluateCommitmentStatus
} from '../business-rules/commitmentRules';
import { Commitment, Session } from '../types';

// Query key factory
export const commitmentTrackingKeys = {
  all: ['commitmentTracking'] as const,
  sessions: (commitmentId: string) => [...commitmentTrackingKeys.all, 'sessions', commitmentId] as const,
  progress: (commitmentId: string) => [...commitmentTrackingKeys.all, 'progress', commitmentId] as const,
};

// Hook to get sessions for a commitment
export const useCommitmentSessions = (commitmentId: string) => {
  return useQuery({
    queryKey: commitmentTrackingKeys.sessions(commitmentId),
    queryFn: () => getCommitmentSessions(commitmentId),
    enabled: !!commitmentId,
  });
};

// Hook to record a new session
export const useRecordSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: recordSession,
    onSuccess: (newSession, variables) => {
      // Update sessions cache
      queryClient.setQueryData(
        commitmentTrackingKeys.sessions(variables.commitmentId),
        (oldSessions: Session[] = []) => [...oldSessions, newSession]
      );
      
      // Invalidate progress cache to recalculate
      queryClient.invalidateQueries({ 
        queryKey: commitmentTrackingKeys.progress(variables.commitmentId) 
      });
    },
    onError: (error) => {
      console.error('Failed to record session:', error);
    },
  });
};

// Hook to evaluate commitment progress
export const useCommitmentProgress = (commitment: Commitment | null) => {
  const { data: sessions = [] } = useCommitmentSessions(commitment?.id || '');
  
  return useQuery({
    queryKey: commitmentTrackingKeys.progress(commitment?.id || ''),
    queryFn: () => {
      if (!commitment) return null;
      
      // Calculate weekly requirements
      const weeklyRequirements = calculateWeeklyRequirements(commitment);
      
      // Update weekly requirements with actual session data
      sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        
        weeklyRequirements.forEach(req => {
          if (sessionDate >= req.weekStart && sessionDate <= req.weekEnd) {
            req.completedSessions++;
            req.sessions = req.sessions || [];
            req.sessions.push(session);
          }
        });
      });
      
      // Mark completed/failed weeks
      weeklyRequirements.forEach(req => {
        req.isCompleted = req.completedSessions >= req.requiredSessions;
        req.isFailed = !req.isCompleted && new Date() > req.weekEnd;
      });
      
      // Evaluate overall commitment status
      const totalCompleted = sessions.length;
      return evaluateCommitmentStatus(commitment, weeklyRequirements, totalCompleted);
    },
    enabled: !!commitment && !!sessions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to process payout
export const useProcessPayout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: processPayout,
    onSuccess: (result, commitmentId) => {
      // Update commitment status to completed
      queryClient.setQueryData(
        commitmentTrackingKeys.progress(commitmentId),
        (oldProgress: CommitmentProgress | null) => {
          if (!oldProgress) return oldProgress;
          
          return {
            ...oldProgress,
            status: 'completed' as const,
            commitment: {
              ...oldProgress.commitment,
              status: 'completed' as const,
              payoutStatus: 'completed' as const,
            }
          };
        }
      );
      
      // Invalidate commitment list to show updated status
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
    },
    onError: (error) => {
      console.error('Failed to process payout:', error);
    },
  });
};

// Hook to check if user can record session today
export const useCanRecordSession = (commitmentId: string) => {
  const { data: sessions = [] } = useCommitmentSessions(commitmentId);
  
  return {
    canRecord: canRecordSessionToday(commitmentId, sessions),
    hasRecordedToday: sessions.some(session => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    }),
    sessionsToday: sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    }).length,
  };
};
