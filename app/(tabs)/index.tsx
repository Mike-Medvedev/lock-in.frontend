import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useMyContext } from "../../context";
export default function Index() {
  const router = useRouter()
  const {goals, setGoals} = useMyContext()
  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        alignItems: "center",
      }}
    >
      <View style={{height: 200, width: "80%", backgroundColor: "#DFDFDF", padding: 20, borderRadius: 6}}>
        <Text>Current Goals</Text>
        <Text>Activity: {goals.activity}</Text>
        <Text>Stake: ${goals.stake}</Text>
        <Text>Duration: {goals.duration} weeks</Text>
        <Text>Frequency: {goals.frequency}x week</Text>
      </View>
      <Button
          title="Lock-In"
          onPress={() => {
            router.push("/lock-in");
          }}
        />
    </View>
  );
}
