import { Icon, ThemedText } from "@/components/ui";
import { ThemeProvider } from "@/theme/themeContext";
import { Stack } from "expo-router";
import { Image } from "react-native";
export default function RootLayout() {
  return <ThemeProvider>
    <Stack>
    <Stack.Screen name="index" options={{ headerTitle: () => <ThemedText variant="title">Lock-In</ThemedText>,
  headerLeft: () => <Image style={{width: 40, height: 40, objectFit: "contain"}} source={require("@/assets/images/logo.png")}/>,
  headerRight: () => <Icon name="notifications-outline" size="large" />}} />
    </Stack>
  </ThemeProvider>;
}
