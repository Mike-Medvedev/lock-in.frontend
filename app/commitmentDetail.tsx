import {
  Background,
  Badge,
  Button,
  Card,
  CelebrationModal,
  FailureModal,
  Icon,
  ProgressBar,
  ThemedText
} from "@/components/ui";
import { useCommitmentPayoutFlow } from "@/hooks/useCommitmentPayout";
import { useVerifiedSession } from "@/hooks/useVerifiedSession";
import { theme } from "@/theme";
import { Commitment } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper functions
const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const daysBetween = (a: Date, b: Date) => {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
};

// Heatmap color classes for React Native
const getHeatmapColor = (level: number) => {
  switch (level) {
    case 0: return theme.semantic.background.secondary;
    case 1: return '#DCFCE7'; // emerald-100
    case 2: return '#86EFAC'; // emerald-300
    case 3: return '#22C55E'; // emerald-500
    case 4: return '#15803D'; // emerald-700
    default: return theme.semantic.background.secondary;
  }
};

// Seeded random generator for consistent demo data
const seededRand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function CommitmentDetail() {
  const router = useRouter();
  const { commitmentId } = useLocalSearchParams<{ commitmentId: string }>();
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  
  // Session state
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [distance, setDistance] = useState(0); // km
  const [hr, setHr] = useState(0); // bpm
  const timerRef = useRef<number | null>(null);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);
  
  // Test modal states
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  
  // Payout system
  const { executePayout, isProcessing, error: payoutError } = useCommitmentPayoutFlow();
  
  // Verified session system
  const {
    isRecording,
    hasLocationPermissions,
    hasHealthPermissions,
    startSession,
    stopSession,
    cancelSession,
    requestPermissions,
    isStarting,
    isStopping,
    startError,
    stopError
  } = useVerifiedSession(commitmentId || '1');

  // Mock commitment data
  useEffect(() => {
    const mockCommitment: Commitment = {
      id: commitmentId || '1',
      title: 'Running 3x / week',
      description: 'Running 3x per week for 2 weeks',
      activity: 'Running',
      duration: '2 weeks',
      frequency: '3x per week',
      stake: 50,
      progress: {
        completed: 5,
        total: 8
      },
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      bonus: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      completedSessions: [],
      weeklyProgress: []
    };
    setCommitment(mockCommitment);
  }, [commitmentId]);

  // Demo heatmap data (past 42 days)
  const heatmapCells = useMemo(() => {
    const arr: { date: Date; count: number; verified: boolean; distanceKm?: number; durationMin?: number }[] = [];
    for (let i = 41; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const r = seededRand(d.getDate() + d.getMonth() * 37 + d.getFullYear());
      const completed = r > 0.7 ? Math.round(r * 3) : 0;
      arr.push({
        date: d,
        count: completed,
        verified: completed > 0,
        distanceKm: completed ? Math.round((r * 6 + 2) * 10) / 10 : undefined,
        durationMin: completed ? Math.round(r * 30 + 20) : undefined,
      });
    }
    return arr;
  }, []);

  // This week's progress
  const weekStart = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  const weekCompleted = useMemo(() => {
    return heatmapCells.filter(c => c.date >= weekStart).reduce((acc, c) => acc + (c.verified ? 1 : 0), 0);
  }, [heatmapCells, weekStart]);

  // Timer effect for active sessions
  useEffect(() => {
    if (active) {
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startedAt) / 1000);
        setElapsed(sec);
        setDistance(prev => Math.round((prev + 0.01 + Math.random() * 0.015) * 100) / 100);
        setHr(130 + Math.round(Math.random() * 30));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setHr(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]);

  const elapsedMMSS = useMemo(() => {
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [elapsed]);

  const handleCellClick = (cell: any) => {
    setSelectedCell(cell);
    setModalVisible(true);
  };

  const handleStartSession = async () => {
    if (!hasLocationPermissions || !hasHealthPermissions) {
      Alert.alert(
        "Permissions Required",
        "This app needs location and health permissions to verify your workout sessions.",
        [
          {
            text: "Grant Permissions",
            onPress: async () => {
              const granted = await requestPermissions();
              if (granted) {
                handleStartSession();
              }
            }
          },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }

    try {
      setElapsed(0);
      setDistance(0);
      setActive(true);
      
      // Start verified session tracking
      await startSession(commitment?.activity || 'running');
      console.log('✅ Verified session started');
    } catch (error) {
      setActive(false);
      Alert.alert(
        "Failed to Start Session",
        error instanceof Error ? error.message : "Unknown error occurred",
        [{ text: "OK" }]
      );
    }
  };

  const handleEndSession = async () => {
    try {
      setActive(false);
      
      // Stop verified session and get results
      const result = await stopSession();
      
      if (result.success) {
        Alert.alert(
          "🎉 Session Verified!",
          `Great job! Your ${commitment?.activity} session has been verified and recorded.\n\n` +
          `Distance: ${result.verification.analysis.totalDistance.toFixed(2)} km\n` +
          `Verification Score: ${(result.verification.verificationScore * 100).toFixed(0)}%`,
          [
            {
              text: "Awesome!",
              onPress: () => {
                console.log("Verified session completed:", result);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "❌ Verification Failed",
          result.error || "Your session could not be verified. Please try again.",
          [
            {
              text: "Try Again",
              onPress: () => setActive(false)
            },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "❌ Session Error",
        error instanceof Error ? error.message : "Failed to complete session",
        [{ text: "OK" }]
      );
    }
  };

  // Handle payout processing
  const handleClaimReward = async () => {
    if (!commitment) return;
    
    try {
      const result = await executePayout(commitment);
      
      if (result.success) {
        Alert.alert(
          "💰 Payout Successful!",
          `Your reward of $${result.amount?.toFixed(2)} has been processed. Transaction ID: ${result.transactionId}`,
          [{ text: "Great!", onPress: () => setShowCelebration(false) }]
        );
      } else {
        Alert.alert(
          "❌ Payout Failed",
          result.error || "Failed to process payout. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "❌ Payout Error",
        "An unexpected error occurred. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (!commitment) {
    return (
      <Background>
        <View style={styles.loadingContainer}>
          <ThemedText variant="lg">Loading commitment...</ThemedText>
        </View>
      </Background>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Background>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Icon name="arrow-back" size="sm" color="secondary" />
            </Pressable>
            <View style={styles.headerContent}>
              <ThemedText variant="lg" weight="semibold">
                {commitment.title}
              </ThemedText>
              <View style={styles.headerInfo}>
                <Badge variant="default" size="sm">
                  Stake ${commitment.stake}
                </Badge>
                <View style={styles.headerItem}>
                  <Icon name="calendar-outline" size="xs" color="secondary" />
                  <ThemedText variant="xs" color="secondary">
                    Ends Oct 6
                  </ThemedText>
                </View>
                <View style={styles.headerItem}>
                  <Icon name="flag-outline" size="xs" color="secondary" />
                  <ThemedText variant="xs" color="secondary">
                    Target 3/week
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* This Week Progress Card */}
          <Card variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText variant="base" weight="semibold">
                This Week
              </ThemedText>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.progressHeader}>
                <ThemedText variant="sm" color="secondary">
                  {weekCompleted} / 3 sessions
                </ThemedText>
                <ThemedText variant="xs" color="secondary">
                  Week of {formatDate(weekStart)}
                </ThemedText>
              </View>
              <ProgressBar 
                value={Math.min(100, (weekCompleted / 3) * 100)} 
                variant="default" 
                size="md" 
                style={styles.progressBar}
              />
            </View>
          </Card>

          {/* Consistency Card */}
          <Card variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText variant="base" weight="semibold">
                Consistency
              </ThemedText>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.heatmapGrid}>
                {heatmapCells.map((cell, idx) => {
                  const level = Math.min(4, cell.count);
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => handleCellClick(cell)}
                      style={[
                        styles.heatmapCell,
                        { backgroundColor: getHeatmapColor(level) }
                      ]}
                    />
                  );
                })}
              </View>
              <View style={styles.heatmapLegend}>
                <ThemedText variant="xs" color="secondary">Less</ThemedText>
                <View style={styles.legendCells}>
                  <View style={[styles.legendCell, { backgroundColor: getHeatmapColor(0) }]} />
                  <View style={[styles.legendCell, { backgroundColor: getHeatmapColor(1) }]} />
                  <View style={[styles.legendCell, { backgroundColor: getHeatmapColor(2) }]} />
                  <View style={[styles.legendCell, { backgroundColor: getHeatmapColor(3) }]} />
                  <View style={[styles.legendCell, { backgroundColor: getHeatmapColor(4) }]} />
                </View>
                <ThemedText variant="xs" color="secondary">More</ThemedText>
              </View>
            </View>
          </Card>

          {/* Session Card */}
          <Card variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText variant="base" weight="semibold">
                Session
              </ThemedText>
            </View>
            <View style={styles.cardContent}>
              {!active ? (
                <View style={styles.sessionInactive}>
                  <ThemedText variant="sm" color="secondary" style={styles.sessionDescription}>
                    Ready to record a verified {commitment?.activity?.toLowerCase() || 'workout'}. GPS & Health data will be tracked.
                  </ThemedText>
                  <Button
                    variant="filled"
                    size="md"
                    style={styles.sessionButton}
                    onPress={handleStartSession}
                    disabled={isStarting || (!hasLocationPermissions && !hasHealthPermissions)}
                  >
                    {isStarting ? (
                      <>
                        <Icon name="hourglass-outline" size="sm" color="inverse" />
                        <ThemedText variant="sm" color="inverse" weight="semibold">
                          Starting...
                        </ThemedText>
                      </>
                    ) : (
                      <>
                        <Icon name="play" size="sm" color="inverse" />
                        <ThemedText variant="sm" color="inverse" weight="semibold">
                          Start Verified Session
                        </ThemedText>
                      </>
                    )}
                  </Button>
                </View>
              ) : (
                <View style={styles.sessionActive}>
                  <View style={styles.sessionStats}>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <Icon name="time-outline" size="xs" color="secondary" />
                        <ThemedText variant="xs" color="secondary">Time</ThemedText>
                      </View>
                      <ThemedText variant="lg" weight="semibold">
                        {elapsedMMSS}
                      </ThemedText>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <Icon name="trending-up-outline" size="xs" color="secondary" />
                        <ThemedText variant="xs" color="secondary">Distance</ThemedText>
                      </View>
                      <ThemedText variant="lg" weight="semibold">
                        {distance.toFixed(2)} km
                      </ThemedText>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statHeader}>
                        <Icon name="heart-outline" size="xs" color="secondary" />
                        <ThemedText variant="xs" color="secondary">Heart</ThemedText>
                      </View>
                      <ThemedText variant="lg" weight="semibold">
                        {hr ? `${hr} bpm` : "--"}
                      </ThemedText>
                    </View>
                  </View>
                  <Button
                    variant="filled"
                    color="error"
                    size="md"
                    style={styles.stopButton}
                    onPress={handleEndSession}
                    disabled={isStopping}
                  >
                    {isStopping ? (
                      <>
                        <Icon name="hourglass-outline" size="sm" color="inverse" />
                        <ThemedText variant="sm" color="inverse" weight="semibold">
                          Verifying...
                        </ThemedText>
                      </>
                    ) : (
                      <>
                        <Icon name="stop" size="sm" color="inverse" />
                        <ThemedText variant="sm" color="inverse" weight="semibold">
                          Stop & Verify
                        </ThemedText>
                      </>
                    )}
                  </Button>
                </View>
              )}
            </View>
          </Card>

          {/* Past Sessions Card */}
          <Card variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText variant="base" weight="semibold">
                Past Sessions
              </ThemedText>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.sessionsList}>
                {heatmapCells.slice(-7).filter(c => c.verified).map((cell, i) => (
                  <View key={i} style={styles.sessionItem}>
                    <View style={styles.sessionIcon}>
                      <Icon name="checkmark-circle" size="sm" color="success" />
                    </View>
                    <View style={styles.sessionInfo}>
                      <ThemedText variant="sm" weight="semibold">
                        {formatDate(cell.date)} • {cell.distanceKm} km • {cell.durationMin} min
                      </ThemedText>
                    </View>
                    <Pressable onPress={() => handleCellClick(cell)}>
                      <ThemedText variant="sm" color="primary">
                        Details
                      </ThemedText>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Test Animations Card */}
          <Card variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <ThemedText variant="base" weight="semibold">
                🎭 Test Animations
              </ThemedText>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.testButtons}>
                <Button
                  variant="filled"
                  color="success"
                  size="md"
                  style={styles.testButton}
                  onPress={() => setShowCelebration(true)}
                >
                  <Icon name="trophy" size="sm" color="inverse" />
                  <ThemedText variant="sm" color="inverse" weight="semibold">
                    Test Success
                  </ThemedText>
                </Button>
                
                <Button
                  variant="filled"
                  color="error"
                  size="md"
                  style={styles.testButton}
                  onPress={() => setShowFailure(true)}
                >
                  <Icon name="close-circle" size="sm" color="inverse" />
                  <ThemedText variant="sm" color="inverse" weight="semibold">
                    Test Failure
                  </ThemedText>
                </Button>
              </View>
              <ThemedText variant="xs" color="secondary" align="center" style={styles.testNote}>
                Tap these buttons to see the celebration and failure animations!
              </ThemedText>
            </View>
          </Card>
        </ScrollView>

        {/* Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText variant="lg" weight="semibold">
                  Session details
                </ThemedText>
                <ThemedText variant="sm" color="secondary">
                  {selectedCell ? formatDate(selectedCell.date) : ''}
                </ThemedText>
              </View>
              {selectedCell && (
                <View style={styles.modalBody}>
                  <View style={styles.modalRow}>
                    <ThemedText variant="sm">Verified:</ThemedText>
                    <ThemedText variant="sm" color={selectedCell.verified ? "success" : "error"}>
                      {selectedCell.verified ? 'Yes' : 'No'}
                    </ThemedText>
                  </View>
                  {selectedCell.distanceKm && (
                    <View style={styles.modalRow}>
                      <ThemedText variant="sm">Distance:</ThemedText>
                      <ThemedText variant="sm">{selectedCell.distanceKm} km</ThemedText>
                    </View>
                  )}
                  {selectedCell.durationMin && (
                    <View style={styles.modalRow}>
                      <ThemedText variant="sm">Duration:</ThemedText>
                      <ThemedText variant="sm">{selectedCell.durationMin} min</ThemedText>
                    </View>
                  )}
                  <ThemedText variant="xs" color="secondary" style={styles.modalNote}>
                    GPS route and HealthKit metrics would appear here.
                  </ThemedText>
                </View>
              )}
              <View style={styles.modalFooter}>
                <Button
                  variant="filled"
                  size="sm"
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText variant="sm" color="inverse">Close</ThemedText>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Celebration Modal */}
        <CelebrationModal
          visible={showCelebration}
          onClose={() => setShowCelebration(false)}
          commitment={{
            id: commitment?.id || '1',
            title: commitment?.title || 'Running Challenge',
            stake: commitment?.stake || 50,
            bonus: commitment?.bonus || 10,
          }}
          onClaimReward={handleClaimReward}
          isProcessingPayout={isProcessing}
          payoutError={payoutError?.message}
        />

        {/* Failure Modal */}
        <FailureModal
          visible={showFailure}
          onClose={() => setShowFailure(false)}
          commitment={{
            title: commitment?.title || 'Running Challenge',
            stake: commitment?.stake || 50,
          }}
          failureReason="Failed to complete 3 sessions this week. Only completed 1 out of 3 required sessions."
        />
      </Background>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[6],
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.semantic.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  headerContent: {
    flex: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  card: {
    marginBottom: theme.spacing[6],
  },
  cardHeader: {
    paddingBottom: theme.spacing[2],
  },
  cardContent: {
    gap: theme.spacing[2],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  progressBar: {
    width: '100%',
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    marginBottom: theme.spacing[4],
  },
  heatmapCell: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendCells: {
    flexDirection: 'row',
    gap: theme.spacing[1],
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  sessionInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionDescription: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  sessionButton: {
    borderRadius: 16,
    paddingHorizontal: theme.spacing[5],
  },
  sessionActive: {
    gap: theme.spacing[4],
  },
  sessionStats: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: theme.semantic.background.secondary,
    padding: theme.spacing[3],
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginBottom: theme.spacing[1],
  },
  stopButton: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    paddingHorizontal: theme.spacing[5],
  },
  sessionsList: {
    gap: theme.spacing[2],
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.semantic.background.secondary,
    padding: theme.spacing[3],
  },
  sessionIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  modalContent: {
    backgroundColor: theme.semantic.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    marginBottom: theme.spacing[4],
  },
  modalBody: {
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalNote: {
    marginTop: theme.spacing[2],
    fontStyle: 'italic',
  },
  modalFooter: {
    alignItems: 'flex-end',
  },
  testButtons: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  testButton: {
    flex: 1,
  },
  testNote: {
    fontStyle: 'italic',
  },
});
