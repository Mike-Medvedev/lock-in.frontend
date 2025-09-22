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
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

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
        <ThemedText variant="2xl" weight="bold" align="center" style={styles.title}>
          Lock In Your Commitment
        </ThemedText>

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
          <View style={styles.durationGrid}>
            {durations.map((duration) => (
              <Pressable
                key={duration}
                style={({ pressed }) => [
                  styles.durationButton,
                  selectedDuration === duration && styles.selectedButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <ThemedText 
                  variant="base" 
                  weight="medium"
                  color={selectedDuration === duration ? 'inverse' : 'primary'}
                  align="center"
                >
                  {duration}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Choose Frequency */}
        <View style={styles.section}>
          <ThemedText variant="lg" weight="semibold" style={styles.sectionTitle}>
            Choose Frequency
          </ThemedText>
          <View style={styles.frequencyContainer}>
            {frequencies.map((frequency) => (
              <Pressable
                key={frequency}
                style={({ pressed }) => [
                  styles.frequencyButton,
                  selectedFrequency === frequency && styles.selectedButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => setSelectedFrequency(frequency)}
              >
                <ThemedText 
                  variant="base" 
                  weight="medium"
                  color={selectedFrequency === frequency ? 'inverse' : 'primary'}
                  align="center"
                >
                  {frequency}
                </ThemedText>
              </Pressable>
            ))}
          </View>
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[3],
  },
  durationButton: {
    width: "48%",
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidths[2],
    borderColor: theme.semantic.border.default,
    backgroundColor: theme.semantic.background.primary,
    alignItems: "center",
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