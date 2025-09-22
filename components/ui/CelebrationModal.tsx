import { theme } from '@/theme';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Icon } from './Icon';
import { ThemedText } from './ThemedText';

interface CelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  commitment: {
    id: string;
    title: string;
    stake: number;
    bonus?: number;
  };
  onClaimReward: () => void;
  isProcessingPayout?: boolean;
  payoutError?: string;
}

const { width } = Dimensions.get('window');

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  onClose,
  commitment,
  onClaimReward,
  isProcessingPayout = false,
  payoutError,
}) => {
  const confettiAnim = useRef(new Animated.Value(0)).current; // used for confetti on claim
  const rotateAnim = useRef(new Animated.Value(0)).current; // trophy spin on open
  const lottieRef = useRef<LottieView>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const hasAnimatedRef = useRef(false);
  
  

  useEffect(() => {
    if (visible) {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      // Open effects: trophy spin and confetti burst
      confettiAnim.setValue(0);
      rotateAnim.setValue(0);
      shakeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]),
      ]).start();

      // Play lottie on open
      requestAnimationFrame(() => {
        lottieRef.current?.reset();
        lottieRef.current?.play();
      });
    } else {
      // allow re-run next time modal opens
      hasAnimatedRef.current = false;
    }
  }, [visible]);

  const confettiOpacity = confettiAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const totalReward = commitment.stake + (commitment.bonus || 0);

  const handleClaimPress = () => {
    // Trigger a quick shake/jiggle and confetti burst, then call the handler
    confettiAnim.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
      Animated.timing(confettiAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ]).start(() => {
      onClaimReward();
    });

    // Replay lottie burst
    lottieRef.current?.reset();
    lottieRef.current?.play();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti effect (render above content) */}
        <Animated.View pointerEvents="none" style={[styles.confetti, { opacity: confettiOpacity }]}> 
          <LottieView
            ref={lottieRef}
            source={require('../../assets/confetti.json')}
            autoPlay={false}
            loop={false}
            style={styles.lottie}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.container,
          ]}
        >
          <View style={styles.content}>
            {/* Trophy Icon */}
            <Animated.View
              style={[
                styles.trophyContainer,
                { transform: [{ rotate: rotateInterpolation }] },
              ]}
            >
              <Icon name="trophy" size="xl" color="warning" />
            </Animated.View>

            {/* Title */}
            <ThemedText variant="2xl" weight="bold" align="center" style={styles.title}>
              🎉 Congratulations! 🎉
            </ThemedText>

            <ThemedText variant="lg" weight="semibold" align="center" style={styles.subtitle}>
              You completed your commitment!
            </ThemedText>

            <ThemedText variant="base" color="secondary" align="center" style={styles.commitmentTitle}>
              {commitment.title}
            </ThemedText>

            {/* Reward Section */}
            <View style={styles.rewardContainer}>
              <ThemedText variant="base" color="secondary" align="center">
                Your reward:
              </ThemedText>
              <ThemedText variant="3xl" weight="bold" color="success" align="center" style={styles.rewardAmount}>
                ${totalReward}
              </ThemedText>
              <View style={styles.rewardBreakdown}>
                <ThemedText variant="sm" color="secondary" align="center">
                  ${commitment.stake} stake returned
                </ThemedText>
                {commitment.bonus && (
                  <ThemedText variant="sm" color="success" align="center">
                    + ${commitment.bonus} bonus
                  </ThemedText>
                )}
              </View>
            </View>

            {/* Error Message */}
            {payoutError && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size="sm" color="error" />
                <ThemedText variant="sm" color="error" align="center">
                  {payoutError}
                </ThemedText>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <Button
                variant="filled"
                size="lg"
                style={styles.claimButton}
                onPress={handleClaimPress}
                disabled={isProcessingPayout}
                >
                  {isProcessingPayout ? (
                    <>
                      <Icon name="hourglass-outline" size="sm" color="inverse" />
                      <ThemedText variant="base" color="inverse" weight="semibold">
                        Processing...
                      </ThemedText>
                    </>
                  ) : (
                    <>
                      <Icon name="cash-outline" size="sm" color="inverse" />
                      <ThemedText variant="base" color="inverse" weight="semibold">
                        Claim Reward
                      </ThemedText>
                    </>
                  )}
                </Button>
              </Animated.View>

              <Button
                variant="outlined"
                size="md"
                style={styles.closeButton}
                onPress={onClose}
                disabled={isProcessingPayout}
              >
                <ThemedText variant="base" weight="semibold">
                  Close
                </ThemedText>
              </Button>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  lottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  container: {
    width: width * 0.9,
    maxWidth: 400,
    zIndex: 1,
  },
  content: {
    backgroundColor: theme.semantic.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  trophyContainer: {
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.semantic.interactive.warning.default + '20',
  },
  title: {
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    marginBottom: theme.spacing[1],
  },
  commitmentTitle: {
    marginBottom: theme.spacing[6],
  },
  rewardContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.semantic.background.secondary,
    width: '100%',
  },
  rewardAmount: {
    marginVertical: theme.spacing[2],
  },
  rewardBreakdown: {
    gap: theme.spacing[1],
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing[3],
  },
  claimButton: {
    backgroundColor: theme.semantic.interactive.success.default,
  },
  closeButton: {
    borderColor: theme.semantic.background.secondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.semantic.interactive.error.default + '10',
  },
});
