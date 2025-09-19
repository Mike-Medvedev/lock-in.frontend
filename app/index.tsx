import { Background, Badge, Button, Card, Icon, Image, ProgressBar, ThemedText } from "@/components/ui";
import { View } from "react-native";
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
      <ThemedText>Edit app/index.tsx to edit this screen. hi</ThemedText>
      <Badge>$50</Badge>
      <Button></Button>
      <Card>?</Card>
      <Icon>?</Icon>
      <Image />
      <ProgressBar>?</ProgressBar>
    </View>
    </Background>
  );
}
