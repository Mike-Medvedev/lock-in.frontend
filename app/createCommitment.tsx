import {
    Background,
    Button,
    MoneyInput,
    ThemedText
} from "@/components/ui";
import { useCreateCommitment } from "@/hooks/useCommitments";
import { useStripePayment } from "@/hooks/useStripePayment";
import { theme } from "@/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

const activities = [
  { id: "running", label: "Running", emoji: "🏃‍♂️" },
  { id: "gym", label: "Gym", emoji: "🏋️‍♀️" }
];

const durations = ["1 Week", "2 Weeks", "3 Weeks", "1 Month"];

const frequencies = ["3x per week", "4x per week", "5x per week", "6x per week", "Daily ✅"];

export default function CreateCommitment() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [stake, setStake] = useState("50");
  const [isStakeValid, setIsStakeValid] = useState(true);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);

  const { presentPayment, loading: paymentLoading } = useStripePayment();
  const { mutateAsync: createCommitment, isPending: isCreatingCommitment } = useCreateCommitment();

  const handleStakeChange = (value: string) => {
    setStake(value);
    
    // Clear validation error when user starts typing
    if (!isStakeValid) {
      setIsStakeValid(true);
    }
  };

  const validateForm = () => {
    if (!selectedActivity || !selectedDuration || !selectedFrequency) {
      Alert.alert("Incomplete Form", "Please select all options before proceeding.");
      return false;
    }

    const stakeAmount = parseFloat(stake);
    if (isNaN(stakeAmount) || stakeAmount < 0.50) {
      setIsStakeValid(false);
      Alert.alert("Invalid Stake", "Minimum stake is $0.50");
      return false;
    }

    return true;
  };

  const handleLockIn = async () => {
    if (!validateForm()) return;

    const stakeAmount = parseFloat(stake);
    
    try {
      // First, present the payment sheet
      const paymentSuccess = await presentPayment(stakeAmount);
      
      if (paymentSuccess) {
        // If payment is successful, create the commitment
        const commitmentData = {
          activity: selectedActivity!,
          duration: selectedDuration!,
          frequency: selectedFrequency!,
          stake: stakeAmount,
        };
        
        // Create the commitment - this will automatically add it to the list via TanStack Query
        await createCommitment(commitmentData);
        
        // Show success message and navigate back
        Alert.alert(
          "Success!",
          "Your commitment has been created and locked in!",
          [{ 
            text: "OK", 
            onPress: () => router.back() 
          }]
        );
        
        console.log("Commitment created successfully!");
      }
    } catch (error) {
      console.error("Error creating commitment:", error);
      Alert.alert(
        "Error",
        "Failed to create commitment. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const isFormValid = selectedActivity && selectedDuration && selectedFrequency && parseFloat(stake) >= 0.50;
  const isLoading = paymentLoading || isCreatingCommitment;

  return (
    <Background>
      <ScrollView style={styles.container}>


        {/* Choose Activity */}
        <View style={styles.section}>
          <ThemedText variant="lg" weight="semibold" style={styles.sectionTitle}>
            Choose Activity
          </ThemedText>
          <View style={styles.activityContainer}>
            {activities.map((activity) => (
              <Pressable
                key={activity.id}
                style={({ pressed }) => [
                  styles.activityButton,
                  selectedActivity === activity.id && styles.selectedButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => setSelectedActivity(activity.id)}
              >
                <ThemedText variant="lg" style={styles.emoji}>
                  {activity.emoji}
                </ThemedText>
                <ThemedText 
                  variant="base" 
                  weight="medium"
                  color={selectedActivity === activity.id ? 'inverse' : 'primary'}
                >
                  {activity.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Choose Duration */}
        <View style={styles.section}>
          <ThemedText variant="lg" weight="semibold" style={styles.sectionTitle}>
            Choose Duration
          </ThemedText>
          <Pressable
            style={({ pressed }) => [styles.selectInput, pressed && { opacity: 0.8 }]}
            onPress={() => setIsDurationOpen(true)}
          >
            <ThemedText variant="base" weight="medium" color="primary" style={styles.selectText}>
              {selectedDuration ?? "Select duration"}
            </ThemedText>
          </Pressable>

          <Modal visible={isDurationOpen} transparent animationType="fade" onRequestClose={() => setIsDurationOpen(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setIsDurationOpen(false)}>
              <View style={styles.modalContent}>
                {durations.map((duration) => (
                  <Pressable
                    key={duration}
                    style={({ pressed }) => [styles.optionItem, pressed && { opacity: 0.7 }, selectedDuration === duration && styles.selectedOption]}
                    onPress={() => {
                      setSelectedDuration(duration);
                      setIsDurationOpen(false);
                    }}
                  >
                    <ThemedText variant="base" weight="medium" color={selectedDuration === duration ? 'inverse' : 'primary'} style={styles.optionText}>
                      {duration}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>

        {/* Choose Frequency */}
        <View style={styles.section}>
          <ThemedText variant="lg" weight="semibold" style={styles.sectionTitle}>
            Choose Frequency
          </ThemedText>
          <Pressable
            style={({ pressed }) => [styles.selectInput, pressed && { opacity: 0.8 }]}
            onPress={() => setIsFrequencyOpen(true)}
          >
            <ThemedText variant="base" weight="medium" color="primary" style={styles.selectText}>
              {selectedFrequency ?? "Select frequency"}
            </ThemedText>
          </Pressable>

          <Modal visible={isFrequencyOpen} transparent animationType="fade" onRequestClose={() => setIsFrequencyOpen(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setIsFrequencyOpen(false)}>
              <View style={styles.modalContent}>
                {frequencies.map((frequency) => (
                  <Pressable
                    key={frequency}
                    style={({ pressed }) => [styles.optionItem, pressed && { opacity: 0.7 }, selectedFrequency === frequency && styles.selectedOption]}
                    onPress={() => {
                      setSelectedFrequency(frequency);
                      setIsFrequencyOpen(false);
                    }}
                  >
                    <ThemedText variant="base" weight="medium" color={selectedFrequency === frequency ? 'inverse' : 'primary'} style={styles.optionText}>
                      {frequency}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>

        {/* Set Your Stake */}
        <View style={styles.section}>
          <ThemedText variant="lg" weight="semibold" style={styles.sectionTitle}>
            How much do you want to lock in?
          </ThemedText>
          <MoneyInput
            value={stake}
            onChange={handleStakeChange}
            error={!isStakeValid ? "Minimum stake is $0.50" : undefined}
            maxAmount={10000}
            style={styles.moneyInput}
          />
          <ThemedText variant="sm" color="secondary" align="center" style={styles.helperText}>
            If you succeed, you get your stake back. If you fail, you lose your stake.
          </ThemedText>
        </View>

        {/* Lock In Button */}
        <Button
          variant="filled"
          size="lg"
          style={styles.lockInButton}
          onPress={handleLockIn}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? "Processing..." : "Lock In"}
        </Button>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing[5],
  },
  title: {
    marginBottom: theme.spacing[8],
  },
  section: {
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
  },
  activityContainer: {
    flexDirection: "row",
    gap: theme.spacing[4],
  },
  activityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidths[2],
    borderColor: theme.semantic.border.default,
    backgroundColor: theme.semantic.background.primary,
    gap: theme.spacing[2],
  },
  selectedButton: {
    backgroundColor: theme.semantic.interactive.primary.default,
    borderColor: theme.semantic.interactive.primary.default,
  },
  emoji: {
    fontSize: 20,
  },
  durationGrid: {
  },
  durationButton: {
  },
  frequencyContainer: {
    gap: theme.spacing[3],
  },
  frequencyButton: {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidths[2],
    borderColor: theme.semantic.border.default,
    backgroundColor: theme.semantic.background.primary,
    alignItems: "center",
  },
  selectInput: {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidths[2],
    borderColor: theme.semantic.border.default,
    backgroundColor: theme.semantic.background.primary,
  },
  selectText: {
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[5],
  },
  modalContent: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.semantic.background.primary,
    overflow: 'hidden',
  },
  optionItem: {
    padding: theme.spacing[4],
    borderBottomWidth: theme.borderWidths[1],
    borderBottomColor: theme.semantic.border.subtle,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: theme.semantic.interactive.primary.default,
  },
  optionText: {
    textAlign: 'center',
  },
  moneyInput: {
    marginVertical: theme.spacing[4],
  },
  helperText: {
    marginTop: theme.spacing[3],
  },
  lockInButton: {
    marginTop: theme.spacing[5],
    marginBottom: theme.spacing[10],
  },
});