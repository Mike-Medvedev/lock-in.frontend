import { StripeProvider } from '@stripe/stripe-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "react-native";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const [publishableKey, setPublishableKey] = useState('');

  async function fetchKey(){
    try {
      const response = await fetch("http://localhost:8000/public-key")
      const data = await response.json();
      return data.publishableKey || data;
    } catch (error) {
      console.log('Failed to fetch publishable key:', error);
      return '';
    }
  }

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); 
    console.log('Setting publishable key:', key);
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider publishableKey={publishableKey}>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerTitle: "Lock-In",
              headerLeft: () => (
                <Image 
                  style={{width: 40, height: 40, objectFit: "contain"}} 
                  source={require("@/assets/images/logo.png")}
                />
              ),
            }} 
          />
        <Stack.Screen 
          name="createCommitment" 
          options={{ 
            headerTitle: "Create Commitment",
            presentation: "modal"
          }} 
        />
        <Stack.Screen 
          name="commitmentDetail" 
          options={{ 
            headerTitle: "Commitment Detail",
            headerShown: false
          }} 
        />
        </Stack>
      </StripeProvider>
    </QueryClientProvider>
  );
}