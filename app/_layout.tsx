import { Stack } from "expo-router";
import { MyContextProvider } from "../context";

export default function RootLayout() {
  return <MyContextProvider>
    <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  </MyContextProvider>
}
