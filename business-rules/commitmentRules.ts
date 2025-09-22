import { Commitment, CommitmentStatus } from '../types';

/**
 * BUSINESS RULES FOR COMMITMENT TRACKING
 * 
 * Core Rules:
 * 1. Frequency defines required sessions per week
 * 2. Only one session per day counts (no stacking)
 * 3. Weekly periods are rolling 7-day periods from start date
 * 4. If weekly target not met by end of 7-day period, commitment fails
 * 5. If user fails to complete required sessions in remaining days, commitment fails
 * 6. On completion of final session, user gets money back + bonus
 * 7. On failure, user loses stake amount
 */

export interface WeeklyRequirement {
  weekNumber: number;
  requiredSessions: number;
  completedSessions: number;
  weekStart: Date;
  weekEnd: Date;
  isCompleted: boolean;
  isFailed: boolean;
  remainingDays: number;
  sessions?: any[];
}

export interface CommitmentProgress {
  commitment: Commitment;
  currentWeek: number;
  totalWeeks: number;
  weeklyRequirements: WeeklyRequirement[];
  totalSessionsCompleted: number;
  totalSessionsRequired: number;
  status: CommitmentStatus;
  canStillSucceed: boolean;
  nextDeadline: Date;
  daysRemainingInWeek: number;
  sessionsNeededThisWeek: number;
}

/**
 * Calculate weekly requirements based on commitment details
 */
export function calculateWeeklyRequirements(commitment: Commitment): WeeklyRequirement[] {
  const startDate = new Date(commitment.startDate);
  const endDate = new Date(commitment.endDate);
  const frequency = parseFrequency(commitment.frequency);
  const totalDays = daysBetween(startDate, endDate);
  const totalWeeks = Math.ceil(totalDays / 7);
  
  const requirements: WeeklyRequirement[] = [];
  
  for (let week = 0; week < totalWeeks; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (week * 7));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Adjust last week if commitment ends before the full 7 days
    if (weekEnd > endDate) {
      weekEnd.setTime(endDate.getTime());
    }
    
    const now = new Date();
    const remainingDays = Math.max(0, Math.ceil((weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    requirements.push({
      weekNumber: week + 1,
      requiredSessions: frequency,
      completedSessions: 0, // This will be calculated from actual sessions
      weekStart,
      weekEnd,
      isCompleted: false,
      isFailed: false,
      remainingDays
    });
  }
  
  return requirements;
}

/**
 * Parse frequency string to number of sessions per week
 */
function parseFrequency(frequency: string): number {
  if (frequency.includes('Daily')) return 7;
  if (frequency.includes('6x')) return 6;
  if (frequency.includes('5x')) return 5;
  if (frequency.includes('4x')) return 4;
  if (frequency.includes('3x')) return 3;
  if (frequency.includes('2x')) return 2;
  if (frequency.includes('1x')) return 1;
  
  // Default fallback
  return 3;
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * Check if user can still meet weekly requirement
 */
export function canStillMeetWeeklyRequirement(requirement: WeeklyRequirement, completedSessions: number): boolean {
  const now = new Date();
  
  // If week has ended, check if requirement was met
  if (now > requirement.weekEnd) {
    return completedSessions >= requirement.requiredSessions;
  }
  
  // Calculate how many days are left in this rolling week
  const daysRemaining = requirement.remainingDays;
  const sessionsStillNeeded = requirement.requiredSessions - completedSessions;
  
  // If no sessions needed, they're good
  if (sessionsStillNeeded <= 0) {
    return true;
  }
  
  // If they need more sessions than days remaining, they can't succeed
  if (sessionsStillNeeded > daysRemaining) {
    return false;
  }
  
  // If it's the last day and they need more than 1 session
  if (daysRemaining <= 1 && sessionsStillNeeded > 1) {
    return false;
  }
  
  // If it's the second to last day and they need more than 2 sessions
  if (daysRemaining <= 2 && sessionsStillNeeded > 2) {
    return false;
  }
  
  // If it's the third to last day and they need more than 3 sessions
  if (daysRemaining <= 3 && sessionsStillNeeded > 3) {
    return false;
  }
  
  // If it's the fourth to last day and they need more than 4 sessions
  if (daysRemaining <= 4 && sessionsStillNeeded > 4) {
    return false;
  }
  
  // If it's the fifth to last day and they need more than 5 sessions
  if (daysRemaining <= 5 && sessionsStillNeeded > 5) {
    return false;
  }
  
  // If it's the sixth to last day and they need more than 6 sessions
  if (daysRemaining <= 6 && sessionsStillNeeded > 6) {
    return false;
  }
  
  return true;
}

/**
 * Evaluate commitment status based on progress
 */
export function evaluateCommitmentStatus(
  commitment: Commitment, 
  weeklyRequirements: WeeklyRequirement[], 
  completedSessions: number
): CommitmentProgress {
  const now = new Date();
  const startDate = new Date(commitment.startDate);
  const endDate = new Date(commitment.endDate);
  
  // Calculate current week (0-indexed)
  const currentWeek = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const totalWeeks = weeklyRequirements.length;
  
  let status: CommitmentStatus = 'active';
  let canStillSucceed = true;
  
  // Check if commitment has ended
  if (now > endDate) {
    // Check if all weeks were completed successfully
    const allWeeksCompleted = weeklyRequirements.every(req => 
      req.isCompleted && req.completedSessions >= req.requiredSessions
    );
    
    if (allWeeksCompleted) {
      status = 'completed';
    } else {
      status = 'failed';
      canStillSucceed = false;
    }
  } else {
    // Check current week and previous weeks
    for (let i = 0; i <= currentWeek && i < totalWeeks; i++) {
      const requirement = weeklyRequirements[i];
      
      // If this week has ended, check if it was completed
      if (now > requirement.weekEnd) {
        if (requirement.completedSessions < requirement.requiredSessions) {
          status = 'failed';
          canStillSucceed = false;
          break;
        } else {
          requirement.isCompleted = true;
        }
      } else {
        // Current week - check if they can still succeed
        if (!canStillMeetWeeklyRequirement(requirement, requirement.completedSessions)) {
          status = 'failed';
          canStillSucceed = false;
          break;
        }
      }
    }
  }
  
  // Calculate next deadline
  let nextDeadline: Date;
  if (currentWeek < totalWeeks) {
    nextDeadline = weeklyRequirements[currentWeek].weekEnd;
  } else {
    nextDeadline = endDate;
  }
  
  // Calculate days remaining in current week
  const daysRemainingInWeek = Math.max(0, Math.ceil((nextDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate sessions needed this week
  let sessionsNeededThisWeek = 0;
  if (currentWeek < totalWeeks) {
    const currentRequirement = weeklyRequirements[currentWeek];
    sessionsNeededThisWeek = Math.max(0, currentRequirement.requiredSessions - currentRequirement.completedSessions);
  }
  
  return {
    commitment,
    currentWeek: currentWeek + 1,
    totalWeeks,
    weeklyRequirements,
    totalSessionsCompleted: completedSessions,
    totalSessionsRequired: weeklyRequirements.reduce((sum, req) => sum + req.requiredSessions, 0),
    status,
    canStillSucceed,
    nextDeadline,
    daysRemainingInWeek,
    sessionsNeededThisWeek
  };
}

/**
 * Check if a session can be recorded (only one per day)
 */
export function canRecordSession(date: Date, existingSessions: Date[]): boolean {
  const sessionDate = new Date(date);
  sessionDate.setHours(0, 0, 0, 0);
  
  // Check if there's already a session on this date
  return !existingSessions.some(existingDate => {
    const existing = new Date(existingDate);
    existing.setHours(0, 0, 0, 0);
    return existing.getTime() === sessionDate.getTime();
  });
}

/**
 * Calculate payout amount for successful completion
 */
export function calculatePayout(commitment: Commitment): number {
  const baseAmount = commitment.stake;
  const bonus = commitment.bonus || 0;
  return baseAmount + bonus;
}

/**
 * Calculate loss amount for failed commitment
 */
export function calculateLoss(commitment: Commitment): number {
  return commitment.stake;
}
