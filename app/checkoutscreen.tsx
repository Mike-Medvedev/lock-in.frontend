import { Button } from "@/components/ui";
import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

const API_URL = "http://localhost:8000"

export default function CheckoutScreen() {
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
        } else {
          console.log('Payment sheet initialized successfully');
          setLoading(true);
        }
      } catch (error) {
        console.log('Failed to initialize payment sheet:', error);
        Alert.alert('Error', 'Failed to initialize payment system');
      }
    };
  
    const openPaymentSheet = async () => {
        try {
          await initializePaymentSheet();
          
          if (loading) {
            const { error } = await presentPaymentSheet();
            console.log('Present payment sheet error:', error);
            if (error) {
              Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
              Alert.alert('Success', 'Your order is confirmed!');
            }
          } else {
            Alert.alert('Error', 'Payment sheet not initialized');
          }
        } catch (error) {
          console.log('Open payment sheet error:', error);
          Alert.alert('Error', 'Failed to open payment sheet');
        }
    };
  
    useEffect(() => {
      initializePaymentSheet();
    }, []);
  
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button onPress={initializePaymentSheet}  title="Init"/>
       <Button   onPress={openPaymentSheet} />
        </View>
    );
  }