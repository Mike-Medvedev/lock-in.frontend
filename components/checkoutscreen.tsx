import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://localhost:8000"

export function useCheckoutScreen(amount: number) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

  
    const fetchPaymentSheetParams = async () => {
      try {
        console.log("sending a fetch request")
        const response = await fetch(`${API_URL}/payment-sheet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"amount" : amount * 100})
        });
        const { paymentIntent } = await response.json();
        return { paymentIntent };
      } catch (error) {
        console.log('Backend not available:', error);
        // Return mock data for testing
        return { paymentIntent: 'pi_mock_test' };
      }
    };
  
    const initializePaymentSheet = async () => {
      try {
        const {paymentIntent} = await fetchPaymentSheetParams();
        console.log('Payment intent:', paymentIntent);
    
        const { error } = await initPaymentSheet({
          merchantDisplayName: "Lock-In App",
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: 'Jane Doe',
          }
        });
        
        if (error) {
          console.log('Init payment sheet error:', error);
          Alert.alert('Initialization Error', error.message);
          return false;
        } else {
          console.log('Payment sheet initialized successfully');
          setLoading(true);
          return true;
        }
      } catch (error) {
        console.log('Failed to initialize payment sheet:', error);
        Alert.alert('Error', 'Failed to initialize payment system');
        return false;
      }
    };
  
    const openPaymentSheet = async () => {
        try {
          const initialized = await initializePaymentSheet();
          
          if (initialized) {
            const { error } = await presentPaymentSheet();
            console.log('Present payment sheet error:', error);
          }
        } catch (error) {
          console.log('Open payment sheet error:', error);
          Alert.alert('Error', 'Failed to open payment sheet');
        }
    };
  
   
  
    return openPaymentSheet;
  }