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
      <ThemedText variant="title">Custom Components</ThemedText>
      <ThemedText variant="heading">Custom Heading</ThemedText>
      <Badge>$50</Badge>
      <Button></Button>
      <Card>
        <ThemedText>Card</ThemedText>
      </Card>
      <Icon name="menu" size="medium" />
      <Image />
      <ProgressBar />
    </View>
    </Background>
  );
}
