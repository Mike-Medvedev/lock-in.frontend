import { Icon, ThemedText } from "@/components/ui";
import { ThemeProvider } from "@/theme/themeContext";
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "react-native";
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

  return <StripeProvider publishableKey={publishableKey}
  ><ThemeProvider>
    <Stack>
    <Stack.Screen name="index" options={{ headerTitle: () => <ThemedText variant="title">Lock-In</ThemedText>,
  headerLeft: () => <Image style={{width: 40, height: 40, objectFit: "contain"}} source={require("@/assets/images/logo.png")}/>,
  headerRight: () => <Icon name="notifications-outline" size="large" />}} />
    </Stack>
  </ThemeProvider>
  </StripeProvider>;
}
