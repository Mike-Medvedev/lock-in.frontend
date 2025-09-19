import { ThemeProvider } from "@/theme/themeContext";
import { Stack } from "expo-router";
export default function RootLayout() {
  return <ThemeProvider>
    <Stack />
  </ThemeProvider>;
}
