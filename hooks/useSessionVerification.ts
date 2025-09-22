import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

export interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  timestamp: number;
}

export interface HealthData {
  heartRate?: number[];
  steps?: number;
  distance?: number;
  calories?: number;
  activeEnergyBurned?: number;
  workoutType?: string;
}

export interface SessionVerificationData {
  sessionId: string;
  startTime: number;
  endTime: number;
  gpsPoints: GPSPoint[];
  healthData: HealthData;
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
  elevationGain: number;
  isVerified: boolean;
  verificationScore: number;
}

export const useSessionVerification = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [sessionData, setSessionData] = useState<SessionVerificationData | null>(null);
  
  const gpsPoints = useRef<GPSPoint[]>([]);
  const healthData = useRef<HealthData>({});
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const startTime = useRef<number>(0);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      console.log('🔍 Requesting location permissions...');
      
      // Check if location services are enabled first
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        console.log('❌ Location services not enabled');
        setHasPermissions(false);
        return;
      }

      // Request foreground location permissions first
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('📍 Foreground location permission:', locationStatus);
      
      if (locationStatus === 'granted') {
        // Only request background if foreground is granted
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        console.log('🌍 Background location permission:', backgroundStatus);
        
        // For now, only require foreground permissions (background is optional)
        setHasPermissions(true);
        console.log('✅ Location permissions granted (foreground required, background optional)');
      } else {
        console.log('❌ Foreground location permission denied');
        setHasPermissions(false);
      }
    } catch (error) {
      console.error('❌ Permission error:', error);
      setHasPermissions(false);
    }
  };

  const startTracking = async (activityType: string = 'running'): Promise<string> => {
    if (!hasPermissions) {
      throw new Error('Permissions not granted');
    }

    const sessionId = `session_${Date.now()}`;
    startTime.current = Date.now();
    gpsPoints.current = [];
    healthData.current = { workoutType: activityType };

    try {
      // Start GPS tracking with high accuracy
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (location) => {
          const gpsPoint: GPSPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || undefined,
            accuracy: location.coords.accuracy || undefined,
            speed: location.coords.speed || undefined,
            timestamp: location.timestamp,
          };
          
          gpsPoints.current.push(gpsPoint);
          setCurrentLocation(location);
          
          // Simulate heart rate data (in production, this would come from HealthKit)
          simulateHealthData();
        }
      );

      setIsTracking(true);
      console.log(`🎯 Started tracking session: ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to start tracking:', error);
      throw error;
    }
  };

  const stopTracking = async (): Promise<SessionVerificationData> => {
    if (!isTracking) {
      throw new Error('Not currently tracking');
    }

    const endTime = Date.now();
    
    // Stop GPS tracking
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    setIsTracking(false);

    // Calculate session metrics
    const verificationData = calculateSessionMetrics(
      gpsPoints.current,
      healthData.current,
      startTime.current,
      endTime
    );

    setSessionData(verificationData);
    console.log('🏁 Session tracking stopped:', verificationData);
    
    return verificationData;
  };

  const simulateHealthData = () => {
    // Simulate realistic health data (in production, integrate with HealthKit)
    const currentHR = Math.floor(120 + Math.random() * 60); // 120-180 BPM
    
    healthData.current = {
      ...healthData.current,
      heartRate: [...(healthData.current.heartRate || []), currentHR],
      steps: (healthData.current.steps || 0) + Math.floor(Math.random() * 3),
      calories: (healthData.current.calories || 0) + 0.1,
      activeEnergyBurned: (healthData.current.activeEnergyBurned || 0) + 0.05,
    };
  };

  const calculateSessionMetrics = (
    gpsPoints: GPSPoint[],
    healthData: HealthData,
    startTime: number,
    endTime: number
  ): SessionVerificationData => {
    let totalDistance = 0;
    let elevationGain = 0;
    let maxSpeed = 0;
    const speeds: number[] = [];

    // Calculate distance and elevation from GPS points
    for (let i = 1; i < gpsPoints.length; i++) {
      const prev = gpsPoints[i - 1];
      const curr = gpsPoints[i];
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(prev, curr);
      totalDistance += distance;
      
      // Calculate elevation gain
      if (prev.altitude && curr.altitude && curr.altitude > prev.altitude) {
        elevationGain += curr.altitude - prev.altitude;
      }
      
      // Track speeds
      if (curr.speed) {
        speeds.push(curr.speed);
        maxSpeed = Math.max(maxSpeed, curr.speed);
      }
    }

    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b) / speeds.length : 0;
    const duration = (endTime - startTime) / 1000; // seconds
    
    // Calculate verification score based on multiple factors
    const verificationScore = calculateVerificationScore({
      gpsPoints,
      totalDistance,
      duration,
      healthData,
      averageSpeed,
    });

    return {
      sessionId: `session_${startTime}`,
      startTime,
      endTime,
      gpsPoints,
      healthData,
      totalDistance: totalDistance / 1000, // Convert to km
      averageSpeed,
      maxSpeed,
      elevationGain,
      isVerified: verificationScore >= 0.7, // 70% threshold
      verificationScore,
    };
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

  const calculateVerificationScore = (data: {
    gpsPoints: GPSPoint[];
    totalDistance: number;
    duration: number;
    healthData: HealthData;
    averageSpeed: number;
  }): number => {
    let score = 0;
    let factors = 0;

    // GPS consistency (30% of score)
    if (data.gpsPoints.length > 10) {
      const accuracyScore = data.gpsPoints.filter(p => (p.accuracy || 100) < 10).length / data.gpsPoints.length;
      score += accuracyScore * 0.3;
      factors += 0.3;
    }

    // Distance vs time consistency (25% of score)
    if (data.duration > 60 && data.totalDistance > 0) {
      const expectedSpeed = data.totalDistance / data.duration; // m/s
      const speedConsistency = Math.min(1, 1 - Math.abs(expectedSpeed - data.averageSpeed) / data.averageSpeed);
      score += speedConsistency * 0.25;
      factors += 0.25;
    }

    // Heart rate data (20% of score)
    if (data.healthData.heartRate && data.healthData.heartRate.length > 0) {
      const avgHR = data.healthData.heartRate.reduce((a, b) => a + b) / data.healthData.heartRate.length;
      const hrScore = avgHR > 100 && avgHR < 200 ? 1 : 0.5; // Realistic HR range
      score += hrScore * 0.2;
      factors += 0.2;
    }

    // Movement consistency (15% of score)
    const movementScore = data.gpsPoints.length > data.duration / 10 ? 1 : 0.5; // Regular GPS updates
    score += movementScore * 0.15;
    factors += 0.15;

    // Duration reasonableness (10% of score)
    const durationScore = data.duration > 300 && data.duration < 10800 ? 1 : 0.5; // 5min - 3hrs
    score += durationScore * 0.1;
    factors += 0.1;

    return factors > 0 ? score / factors : 0;
  };

  return {
    isTracking,
    hasPermissions,
    currentLocation,
    sessionData,
    startTracking,
    stopTracking,
    requestPermissions,
  };
};
