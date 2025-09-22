import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { recordSession } from '../api/sessions';
import { submitSessionForVerification, VerificationResponse } from '../api/verification';
import { Session } from '../types';
import { useHealthKit } from './useHealthKit';
import { useSessionVerification } from './useSessionVerification';

export interface VerifiedSessionResult {
  session: Session;
  verification: VerificationResponse;
  success: boolean;
  error?: string;
}

export const useVerifiedSession = (commitmentId: string) => {
  const queryClient = useQueryClient();
  const { 
    startTracking, 
    stopTracking, 
    isTracking, 
    hasPermissions: hasLocationPermissions 
  } = useSessionVerification();
  
  const { 
    requestPermissions: requestHealthPermissions, 
    startWorkout, 
    endWorkout, 
    getSessionHealthData,
    saveWorkout,
    isAuthorized: hasHealthPermissions 
  } = useHealthKit();

  const [isRecording, setIsRecording] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const workoutId = useRef<string | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  // Request all necessary permissions
  const requestAllPermissions = async (): Promise<boolean> => {
    try {
      const healthPermissions = await requestHealthPermissions();
      return hasLocationPermissions && healthPermissions;
    } catch (error) {
      console.error('❌ Failed to request permissions:', error);
      return false;
    }
  };

  // Start verified session recording
  const startVerifiedSession = useMutation({
    mutationFn: async (activityType: string): Promise<string> => {
      if (isRecording) {
        throw new Error('Session already in progress');
      }

      // Check permissions
      const hasPermissions = await requestAllPermissions();
      if (!hasPermissions) {
        throw new Error('Required permissions not granted');
      }

      try {
        setIsRecording(true);
        sessionStartTime.current = new Date();

        // Start GPS tracking
        const sessionId = await startTracking(activityType);
        setCurrentSessionId(sessionId);

        // Start HealthKit workout
        workoutId.current = await startWorkout(activityType);

        console.log(`🎯 Started verified session: ${sessionId}`);
        return sessionId;
      } catch (error) {
        setIsRecording(false);
        setCurrentSessionId(null);
        workoutId.current = null;
        sessionStartTime.current = null;
        throw error;
      }
    },
    onError: (error) => {
      console.error('❌ Failed to start verified session:', error);
    },
  });

  // Stop and verify session
  const stopVerifiedSession = useMutation({
    mutationFn: async (): Promise<VerifiedSessionResult> => {
      if (!isRecording || !currentSessionId || !sessionStartTime.current) {
        throw new Error('No session in progress');
      }

      const endTime = new Date();

      try {
        // Stop GPS tracking and get verification data
        const trackingData = await stopTracking();

        // End HealthKit workout
        let workoutData = null;
        if (workoutId.current) {
          workoutData = await endWorkout(workoutId.current);
        }

        // Get additional health data for the session period
        const healthData = await getSessionHealthData(sessionStartTime.current, endTime);

        // Combine all verification data
        const verificationRequest = {
          sessionId: currentSessionId,
          commitmentId,
          activityType: trackingData.healthData.workoutType || 'running',
          startTime: sessionStartTime.current.getTime(),
          endTime: endTime.getTime(),
          gpsPoints: trackingData.gpsPoints,
          healthData: {
            ...trackingData.healthData,
            ...healthData,
          },
          deviceInfo: {
            platform: Platform.OS,
            deviceId: 'mock_device_id', // In production, get real device ID
            appVersion: '1.0.0',
          },
        };

        // Submit for verification
        const verificationResult = await submitSessionForVerification(verificationRequest);

        // Only record session if verification passes
        if (!verificationResult.isVerified) {
          throw new Error(`Session verification failed: ${verificationResult.flags.map(f => f.message).join(', ')}`);
        }

        // Record the verified session
        const sessionData = {
          commitmentId,
          date: sessionStartTime.current.toISOString(),
          duration: Math.round((endTime.getTime() - sessionStartTime.current.getTime()) / 1000 / 60), // minutes
          distance: verificationResult.analysis.totalDistance,
          heartRate: Math.round(verificationResult.analysis.averageHeartRate),
        };

        const recordedSession = await recordSession(sessionData);

        // Save workout to HealthKit
        if (workoutData && hasHealthPermissions) {
          await saveWorkout({
            type: verificationRequest.activityType,
            startTime: sessionStartTime.current,
            endTime,
            distance: verificationResult.analysis.totalDistance * 1000, // Convert to meters
            calories: verificationResult.analysis.caloriesBurned,
            heartRateData: trackingData.healthData.heartRate || [],
          });
        }

        console.log('✅ Verified session completed:', {
          session: recordedSession,
          verification: verificationResult,
        });

        return {
          session: recordedSession,
          verification: verificationResult,
          success: true,
        };
      } catch (error) {
        console.error('❌ Failed to complete verified session:', error);
        return {
          session: {} as Session, // Empty session object
          verification: {} as VerificationResponse, // Empty verification
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      } finally {
        // Reset state
        setIsRecording(false);
        setCurrentSessionId(null);
        workoutId.current = null;
        sessionStartTime.current = null;
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        // Update sessions cache
        queryClient.invalidateQueries({ 
          queryKey: ['commitmentTracking', 'sessions', commitmentId] 
        });
        
        // Update commitment progress
        queryClient.invalidateQueries({ 
          queryKey: ['commitmentTracking', 'progress', commitmentId] 
        });
      }
    },
    onError: (error) => {
      console.error('❌ Failed to stop verified session:', error);
    },
  });

  // Cancel current session
  const cancelSession = async (): Promise<void> => {
    if (!isRecording) return;

    try {
      // Stop tracking without recording
      if (isTracking) {
        await stopTracking();
      }

      // End workout without saving
      if (workoutId.current) {
        await endWorkout(workoutId.current);
      }

      console.log('🚫 Session cancelled');
    } catch (error) {
      console.error('❌ Error cancelling session:', error);
    } finally {
      // Reset state
      setIsRecording(false);
      setCurrentSessionId(null);
      workoutId.current = null;
      sessionStartTime.current = null;
    }
  };

  return {
    // State
    isRecording,
    currentSessionId,
    hasLocationPermissions,
    hasHealthPermissions,
    
    // Actions
    startSession: startVerifiedSession.mutateAsync,
    stopSession: stopVerifiedSession.mutateAsync,
    cancelSession,
    requestPermissions: requestAllPermissions,
    
    // Loading states
    isStarting: startVerifiedSession.isPending,
    isStopping: stopVerifiedSession.isPending,
    
    // Errors
    startError: startVerifiedSession.error,
    stopError: stopVerifiedSession.error,
  };
};
