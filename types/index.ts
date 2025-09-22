export interface Commitment {
  id: string;
  title: string;
  description: string;
  activity: string;
  duration: string;
  frequency: string;
  stake: number;
  progress: {
    completed: number;
    total: number;
  };
  status: CommitmentStatus;
  startDate: string;
  endDate: string;
  bonus?: number;
  createdAt: string;
  updatedAt: string;
  // New tracking fields
  completedSessions: Session[];
  weeklyProgress: WeeklyProgress[];
  payoutStatus?: 'pending' | 'completed' | 'failed';
  lastEvaluatedAt?: string;
}

export interface Session {
  id: string;
  commitmentId: string;
  date: string; // ISO date string
  duration: number; // minutes
  distance?: number; // km
  heartRate?: number; // bpm
  verified: boolean;
  createdAt: string;
}

export interface WeeklyProgress {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  requiredSessions: number;
  completedSessions: number;
  isCompleted: boolean;
  isFailed: boolean;
  sessions: Session[];
}

export type CommitmentStatus = 'active' | 'completed' | 'failed' | 'paused';

export interface CreateCommitmentRequest {
  activity: string;
  duration: string;
  frequency: string;
  stake: number;
}

export interface CreateCommitmentResponse {
  commitment: Commitment;
  paymentIntent: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
