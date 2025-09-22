import { theme } from '@/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Icon } from './Icon';
import { ThemedText } from './ThemedText';

interface FailureModalProps {
  visible: boolean;
  onClose: () => void;
  commitment: {
    title: string;
    stake: number;
  };
  failureReason: string;
}

export const FailureModal: React.FC<FailureModalProps> = ({
  visible,
  onClose,
  commitment,
  failureReason,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      slideAnim.setValue(300);

      // Start animations
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.content}>
            {/* Failure Icon */}
            <View style={styles.iconContainer}>
              <Icon name="close-circle" size="xl" color="error" />
            </View>

            {/* Title */}
            <ThemedText variant="2xl" weight="bold" align="center" style={styles.title}>
              Commitment Failed
            </ThemedText>

            <ThemedText variant="base" color="secondary" align="center" style={styles.commitmentTitle}>
              {commitment.title}
            </ThemedText>

            {/* Failure Reason */}
            <View style={styles.reasonContainer}>
              <ThemedText variant="base" color="secondary" align="center">
                Reason:
              </ThemedText>
              <ThemedText variant="base" weight="semibold" align="center" style={styles.reason}>
                {failureReason}
              </ThemedText>
            </View>

            {/* Loss Section */}
            <View style={styles.lossContainer}>
              <ThemedText variant="base" color="secondary" align="center">
                Amount lost:
              </ThemedText>
              <ThemedText variant="2xl" weight="bold" color="error" align="center" style={styles.lossAmount}>
                ${commitment.stake}
              </ThemedText>
              <ThemedText variant="sm" color="secondary" align="center">
                Your stake has been forfeited
              </ThemedText>
            </View>

            {/* Encouragement */}
            <View style={styles.encouragementContainer}>
              <Icon name="bulb-outline" size="md" color="warning" />
              <ThemedText variant="sm" color="secondary" align="center" style={styles.encouragement}>
                Don't give up! Try setting smaller, more achievable goals next time.
              </ThemedText>
            </View>

            {/* Button */}
            <Button
              variant="filled"
              size="lg"
              style={styles.closeButton}
              onPress={onClose}
            >
              <ThemedText variant="base" color="inverse" weight="semibold">
                I Understand
              </ThemedText>
            </Button>
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
    padding: theme.spacing[4],
  },
  container: {
    width: '100%',
    maxWidth: 400,
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
  iconContainer: {
    marginBottom: theme.spacing[4],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.semantic.interactive.error.default + '20',
  },
  title: {
    marginBottom: theme.spacing[2],
    color: theme.semantic.text.error,
  },
  commitmentTitle: {
    marginBottom: theme.spacing[4],
  },
  reasonContainer: {
    marginBottom: theme.spacing[6],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.semantic.background.secondary,
    width: '100%',
  },
  reason: {
    marginTop: theme.spacing[1],
    color: theme.semantic.text.error,
  },
  lossContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.semantic.interactive.error.default + '10',
    width: '100%',
  },
  lossAmount: {
    marginVertical: theme.spacing[2],
  },
  encouragementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[6],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.semantic.interactive.warning.default + '10',
  },
  encouragement: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: theme.semantic.interactive.error.default,
    width: '100%',
  },
});
