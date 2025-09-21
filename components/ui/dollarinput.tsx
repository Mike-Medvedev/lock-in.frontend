import theme from "@/theme/theme";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function DollarInput() {
  const [amount, setAmount] = useState(50);
  const [editing, setEditing] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setEditing(true)} style={styles.amountWrapper}>
        {editing ? (
          <TextInput
          autoFocus
          value={`$${amount.toString()}`}
          onChangeText={(text) => {
            // remove $ and commas
            const cleaned = text.replace(/[^0-9]/g, "");
            const num = parseInt(cleaned || "0", 10);
            setAmount(num);
          }}
          keyboardType="numeric"
          onBlur={() => setEditing(false)}
          style={styles.input}
        />
        
        ) : (
          <Text style={styles.amountText}>{formatCurrency(amount)}</Text>
        )}
      </Pressable>
      <Text style={styles.label}>Your Stake</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: theme.card.margin,
  },
  amountWrapper: {
    paddingVertical: theme.button.margin,
  },
  amountText: {
    fontSize: 42,
    fontWeight: theme.text.fontWeightBold as any,
    color: theme.text.defaultColor,
  },
  input: {
    fontSize: 42,
    fontWeight: theme.text.fontWeightBold as any,
    color: theme.text.defaultColor,
    textAlign: "center",
    minWidth: 120,
  },
  label: {
    marginTop: theme.button.margin,
    fontSize: theme.text.fontSizeBase,
    color: theme.text.secondaryColor,
  },
});
