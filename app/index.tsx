import { useRouter } from "expo-router";
import { Button, View } from "react-native";

export default function Index() {
  const router = useRouter()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
          title="Lock-In"
          onPress={() => router.push("/lock-in")}
        />
    </View>
  );
}
