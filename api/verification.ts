import { GPSPoint, HealthData } from '../hooks/useSessionVerification';
import { ApiResponse } from '../types';

const API_URL = "http://localhost:8000";

export interface VerificationRequest {
  sessionId: string;
  commitmentId: string;
  activityType: string;
  startTime: number;
  endTime: number;
  gpsPoints: GPSPoint[];
  healthData: HealthData;
  deviceInfo: {
    platform: string;
    deviceId: string;
    appVersion: string;
  };
}

export interface VerificationResponse {
  sessionId: string;
  isVerified: boolean;
  verificationScore: number;
  flags: VerificationFlag[];
  analysis: VerificationAnalysis;
  status: 'verified' | 'suspicious' | 'rejected';
}

export interface VerificationFlag {
  type: 'gps_inconsistency' | 'speed_anomaly' | 'heart_rate_anomaly' | 'distance_mismatch' | 'time_manipulation' | 'location_spoofing';
  severity: 'low' | 'medium' | 'high';
  message: string;
  confidence: number;
}

export interface VerificationAnalysis {
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
  elevationGain: number;
  averageHeartRate: number;
  maxHeartRate: number;
  caloriesBurned: number;
  routeConsistency: number;
  movementPattern: 'consistent' | 'erratic' | 'suspicious';
  estimatedEffort: 'low' | 'moderate' | 'high' | 'extreme';
}

// Submit session data for verification
export const submitSessionForVerification = async (
  verificationData: VerificationRequest
): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`${API_URL}/sessions/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.statusText}`);
    }

    const result: ApiResponse<VerificationResponse> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error submitting session for verification:', error);
    
    // Mock verification for development
    return performMockVerification(verificationData);
  }
};

// Mock verification algorithm for development
const performMockVerification = (data: VerificationRequest): VerificationResponse => {
  const analysis = analyzeSessionData(data);
  const flags = detectAnomalies(data, analysis);
  const verificationScore = calculateVerificationScore(analysis, flags);
  
  let status: 'verified' | 'suspicious' | 'rejected' = 'verified';
  if (verificationScore < 0.3) status = 'rejected';
  else if (verificationScore < 0.7) status = 'suspicious';

  return {
    sessionId: data.sessionId,
    isVerified: status === 'verified',
    verificationScore,
    flags,
    analysis,
    status,
  };
};

const analyzeSessionData = (data: VerificationRequest): VerificationAnalysis => {
  const { gpsPoints, healthData, startTime, endTime } = data;
  const duration = (endTime - startTime) / 1000; // seconds
  
  // Calculate distance from GPS points
  let totalDistance = 0;
  const speeds: number[] = [];
  let elevationGain = 0;
  
  for (let i = 1; i < gpsPoints.length; i++) {
    const prev = gpsPoints[i - 1];
    const curr = gpsPoints[i];
    
    const distance = calculateDistance(prev, curr);
    totalDistance += distance;
    
    const timeDiff = (curr.timestamp - prev.timestamp) / 1000;
    if (timeDiff > 0) {
      const speed = distance / timeDiff;
      speeds.push(speed);
    }
    
    if (prev.altitude && curr.altitude && curr.altitude > prev.altitude) {
      elevationGain += curr.altitude - prev.altitude;
    }
  }
  
  const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b) / speeds.length : 0;
  const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
  
  // Analyze heart rate data
  const heartRates = healthData.heartRate || [];
  const averageHeartRate = heartRates.length > 0 ? heartRates.reduce((a, b) => a + b) / heartRates.length : 0;
  const maxHeartRate = heartRates.length > 0 ? Math.max(...heartRates) : 0;
  
  // Calculate route consistency
  const routeConsistency = calculateRouteConsistency(gpsPoints);
  
  // Determine movement pattern
  const movementPattern = determineMovementPattern(speeds, routeConsistency);
  
  // Estimate effort level
  const estimatedEffort = estimateEffortLevel(averageHeartRate, averageSpeed, duration);
  
  // Estimate calories burned
  const caloriesBurned = estimateCaloriesBurned(duration, averageHeartRate, totalDistance);
  
  return {
    totalDistance: totalDistance / 1000, // Convert to km
    averageSpeed,
    maxSpeed,
    elevationGain,
    averageHeartRate,
    maxHeartRate,
    caloriesBurned,
    routeConsistency,
    movementPattern,
    estimatedEffort,
  };
};

const detectAnomalies = (data: VerificationRequest, analysis: VerificationAnalysis): VerificationFlag[] => {
  const flags: VerificationFlag[] = [];
  
  // Check for impossible speeds
  if (analysis.maxSpeed > 15) { // 15 m/s = ~54 km/h
    flags.push({
      type: 'speed_anomaly',
      severity: 'high',
      message: `Maximum speed of ${(analysis.maxSpeed * 3.6).toFixed(1)} km/h is unrealistic for running`,
      confidence: 0.95,
    });
  }
  
  // Check for GPS inconsistencies
  const accuratePoints = data.gpsPoints.filter(p => (p.accuracy || 100) < 10).length;
  const accuracyRatio = accuratePoints / data.gpsPoints.length;
  
  if (accuracyRatio < 0.5) {
    flags.push({
      type: 'gps_inconsistency',
      severity: 'medium',
      message: 'Poor GPS accuracy detected - possible indoor activity or GPS spoofing',
      confidence: 0.7,
    });
  }
  
  // Check heart rate anomalies
  if (analysis.averageHeartRate < 80 || analysis.averageHeartRate > 200) {
    flags.push({
      type: 'heart_rate_anomaly',
      severity: 'medium',
      message: `Average heart rate of ${analysis.averageHeartRate.toFixed(0)} BPM is unusual`,
      confidence: 0.6,
    });
  }
  
  // Check for teleportation (sudden location jumps)
  const teleportationDetected = detectTeleportation(data.gpsPoints);
  if (teleportationDetected) {
    flags.push({
      type: 'location_spoofing',
      severity: 'high',
      message: 'Sudden location changes detected - possible GPS manipulation',
      confidence: 0.9,
    });
  }
  
  return flags;
};

const calculateDistance = (point1: GPSPoint, point2: GPSPoint): number => {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = (point1.latitude * Math.PI) / 180;
  const lat2Rad = (point2.latitude * Math.PI) / 180;
  const deltaLatRad = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const deltaLngRad = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const calculateRouteConsistency = (gpsPoints: GPSPoint[]): number => {
  if (gpsPoints.length < 3) return 0;
  
  let consistentMovements = 0;
  const threshold = 50; // 50 meters
  
  for (let i = 2; i < gpsPoints.length; i++) {
    const dist1 = calculateDistance(gpsPoints[i - 2], gpsPoints[i - 1]);
    const dist2 = calculateDistance(gpsPoints[i - 1], gpsPoints[i]);
    
    if (Math.abs(dist1 - dist2) < threshold) {
      consistentMovements++;
    }
  }
  
  return consistentMovements / (gpsPoints.length - 2);
};

const determineMovementPattern = (speeds: number[], routeConsistency: number): 'consistent' | 'erratic' | 'suspicious' => {
  if (speeds.length === 0) return 'suspicious';
  
  const speedVariation = calculateVariation(speeds);
  
  if (speedVariation < 2 && routeConsistency > 0.7) return 'consistent';
  if (speedVariation > 5 || routeConsistency < 0.3) return 'suspicious';
  return 'erratic';
};

const estimateEffortLevel = (avgHeartRate: number, avgSpeed: number, duration: number): 'low' | 'moderate' | 'high' | 'extreme' => {
  const hrZone = avgHeartRate / 180; // Rough HR zone calculation
  const speedKmh = avgSpeed * 3.6;
  
  if (hrZone < 0.6 && speedKmh < 6) return 'low';
  if (hrZone < 0.7 && speedKmh < 10) return 'moderate';
  if (hrZone < 0.85 && speedKmh < 15) return 'high';
  return 'extreme';
};

const estimateCaloriesBurned = (duration: number, avgHeartRate: number, distance: number): number => {
  // Simplified calorie calculation
  const minutes = duration / 60;
  const baseRate = 10; // calories per minute
  const hrMultiplier = avgHeartRate / 140; // HR adjustment
  const distanceBonus = distance * 0.1; // Distance bonus
  
  return Math.round((baseRate * minutes * hrMultiplier) + distanceBonus);
};

const detectTeleportation = (gpsPoints: GPSPoint[]): boolean => {
  const maxReasonableSpeed = 20; // 20 m/s = 72 km/h
  
  for (let i = 1; i < gpsPoints.length; i++) {
    const prev = gpsPoints[i - 1];
    const curr = gpsPoints[i];
    
    const distance = calculateDistance(prev, curr);
    const timeDiff = (curr.timestamp - prev.timestamp) / 1000;
    
    if (timeDiff > 0) {
      const speed = distance / timeDiff;
      if (speed > maxReasonableSpeed) {
        return true;
      }
    }
  }
  
  return false;
};

const calculateVariation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((a, b) => a + b) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / values.length;
  
  return Math.sqrt(variance);
};

const calculateVerificationScore = (analysis: VerificationAnalysis, flags: VerificationFlag[]): number => {
  let score = 1.0;
  
  // Deduct points for flags
  flags.forEach(flag => {
    const deduction = flag.severity === 'high' ? 0.3 : flag.severity === 'medium' ? 0.2 : 0.1;
    score -= deduction * flag.confidence;
  });
  
  // Bonus for consistent movement
  if (analysis.movementPattern === 'consistent') {
    score += 0.1;
  } else if (analysis.movementPattern === 'suspicious') {
    score -= 0.2;
  }
  
  // Bonus for realistic heart rate data
  if (analysis.averageHeartRate > 100 && analysis.averageHeartRate < 180) {
    score += 0.05;
  }
  
  return Math.max(0, Math.min(1, score));
};

// Get verification history for a commitment
export const getVerificationHistory = async (commitmentId: string): Promise<VerificationResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/commitments/${commitmentId}/verifications`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch verification history: ${response.statusText}`);
    }

    const result: ApiResponse<VerificationResponse[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching verification history:', error);
    return [];
  }
};
