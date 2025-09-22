import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://localhost:8000";

export function useStripePayment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = async (amount: number) => {
    try {
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }) // Convert to cents
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { paymentIntent } = await response.json();
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const initializePaymentSheet = async (amount: number) => {
    try {
      setLoading(true);
      const paymentIntent = await createPaymentIntent(amount);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Lock-In App",
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'User',
        }
      });

      if (error) {
        console.error('Payment sheet initialization error:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize payment sheet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const presentPayment = async (amount: number) => {
    try {
      await initializePaymentSheet(amount);
      
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert('Payment Failed', error.message);
        return false;
      } else {
        Alert.alert('Success', 'Payment completed successfully!');
        return true;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
      return false;
    }
  };

  return {
    presentPayment,
    loading
  };
}
