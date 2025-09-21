import { useCheckoutScreen } from "@/components/checkoutscreen";
import { DollarInput, ThemedText } from "@/components/ui";
import theme from "@/theme/theme";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const activities = ["Running 🏃‍♂️", "Gym 🏋️‍♀️"];
const durations = ["1 Week", "2 Weeks", "3 Weeks", "1 Month"];
const frequencies = ["3x per week", "4x per week", "5x per week", "6x per week", "Daily ✅"];

export default function CreateCommitmentStepper() {
  const [step, setStep] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [stake, setStake] = useState(0);
  const [isStakeValid, setIsStakeValid] = useState(true)

  const handlePayment = useCheckoutScreen(stake);
  const steps = [
    {
      title: "Choose Activity",
      content: activities.map((a) => (
        <OptionButton
          key={a}
          label={a}
          selected={selectedActivity === a}
          onPress={() => setSelectedActivity(a)}
        />
      )),
    },
    {
      title: "Choose Duration",
      content: durations.map((d) => (
        <OptionButton
          key={d}
          label={d}
          selected={selectedDuration === d}
          onPress={() => setSelectedDuration(d)}
        />
      )),
    },
    {
      title: "Choose Frequency",
      content: frequencies.map((f) => (
        <OptionButton
          key={f}
          label={f}
          selected={selectedFrequency === f}
          onPress={() => setSelectedFrequency(f)}
        />
      )),
    },
    {
      title: "Set Your Stake",
        content: (
          <>
          <DollarInput onChange={(v) => {
            setStake(v);
            if (v >= 0.50) {
              setIsStakeValid(true);
            }
          }}/>
         {!isStakeValid && <ThemedText variant="error" styles={{alignSelf: "center"}}>Minimum Stake is $0.50</ThemedText>}
         </>

        ),
      helper:
        "If you succeed, you get your stake back + rewards. If you fail, you lose your stake.",
    },
    {
      title: "Review & Lock In",
      content: (
        <View style={styles.reviewBox}>
          <Text style={styles.reviewText}>
            Activity: {selectedActivity}{"\n"}
            Duration: {selectedDuration}{"\n"}
            Frequency: {selectedFrequency}{"\n"}
            Stake: ${stake}
          </Text>
        </View>
      ),
    },
  ];

  const isLast = step === steps.length - 1;

  const isFirst = step === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{steps[step].title}</Text>
      <View style={styles.stepContent}>{steps[step].content}</View>
      {steps[step].helper && <Text style={styles.helper}>{steps[step].helper}</Text>}

      <View style={styles.buttonContainer}>
        {!isFirst && (
          <Pressable
            style={[styles.backButton, styles.halfButton]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}
        
        <Pressable
          style={[
            styles.nextButton, 
            isFirst ? styles.fullButton : styles.halfButton,
            { marginTop: theme.button.margin }
          ]}
          onPress={async () => {
            if(step===steps.length -2) {if(stake<0.50) {setIsStakeValid(false); return;}}
            if (!isLast) setStep(step + 1);
            else {
              console.log("Lock In with data:", { selectedActivity, selectedDuration, selectedFrequency, stake });
              await handlePayment()
            };
          }}
        >
          <Text style={styles.nextButtonText}>{isLast ? `Lock In with $${stake}` : "Next"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ✅ Reusable option button
function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.option, selected && styles.optionSelected]} onPress={onPress}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.color,
    padding: theme.card.padding,
  },
  sectionTitle: {
    fontSize: theme.text.fontSizeXL,
    fontWeight: theme.text.fontWeightBold as any,
    color: theme.text.defaultColor,
    marginBottom: theme.button.margin,
  },
  stepContent: {
    marginBottom: theme.card.margin,
  },
  option: {
    borderWidth: theme.button.borderWidth,
    borderColor: theme.button.borderColor,
    borderRadius: theme.button.borderRadius,
    padding: theme.button.padding,
    margin: theme.button.margin,
    backgroundColor: theme.card.background,
  },
  optionSelected: {
    backgroundColor: theme.button.background,
    borderColor: theme.button.background,
  },
  optionText: {
    fontSize: theme.text.fontSizeBase,
    color: theme.text.defaultColor,
    textAlign: "center",
  },
  optionTextSelected: {
    color: theme.button.color,
    fontWeight: theme.text.fontWeightBold as any,
  },
  stakeInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: theme.card.borderWidth,
    borderColor: theme.card.border,
    borderRadius: theme.card.radius,
    paddingHorizontal: theme.button.padding,
    marginVertical: theme.button.margin,
  },
  dollar: {
    fontSize: theme.text.fontSizeLarge,
    color: theme.text.secondaryColor,
    marginRight: theme.button.margin,
  },
  stakeInput: {
    flex: 1,
    fontSize: theme.text.fontSizeLarge,
    color: theme.text.defaultColor,
  },
  helper: {
    fontSize: theme.text.fontSizeSmall,
    color: theme.text.secondaryColor,
  },
  reviewBox: {
    borderWidth: theme.card.borderWidth,
    borderColor: theme.card.border,
    borderRadius: theme.card.radius,
    padding: theme.card.padding,
    backgroundColor: theme.card.background,
  },
  reviewText: {
    fontSize: theme.text.fontSizeBase,
    color: theme.text.defaultColor,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: theme.button.margin,
  },
  nextButton: {
    backgroundColor: theme.button.background,
    borderRadius: theme.button.borderRadius,
    padding: theme.button.padding,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    backgroundColor: "transparent",
    borderWidth: theme.button.borderWidth,
    borderColor: theme.button.borderColor,
    borderRadius: theme.button.borderRadius,
    padding: theme.button.padding,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: theme.button.color,
    fontSize: theme.text.fontSizeLarge,
    fontWeight: theme.text.fontWeightBold as any,
  },
  backButtonText: {
    color: theme.text.defaultColor,
    fontSize: theme.text.fontSizeLarge,
    fontWeight: theme.text.fontWeightBold as any,
  },
  fullButton: {
    flex: 1,
  },
  halfButton: {
    flex: 1,
  },
});
