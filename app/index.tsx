import Background from "@/components/ui/background";
import { Text, View } from "react-native";
export default function Index() {
  return (
    <Background>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen. hi</Text>
    </View>
    </Background>
  );
}
