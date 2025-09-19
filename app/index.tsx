import { Background, Card, Icon, ThemedText } from "@/components/ui";
import { useTheme } from "@/theme/themeContext";
import { View } from "react-native";
export default function Index() {
  const theme = useTheme()
  return (
    <Background>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText variant="title">Lock-In</ThemedText>
      <ThemedText variant="secondary">Stay Commited, earn rewards</ThemedText>
      <View style={{backgroundColor: "#1B8C59", width: 50, height: 50, borderRadius: theme.badge.borderRadius, justifyContent: "center", alignItems: "center"}}>
      <Icon name="arrow-up" size="large" color="white" />
      
      </View>
      <Card>
      <View style={{backgroundColor: "#1B8C59", width: 50, height: 50, borderRadius: theme.badge.borderRadius, justifyContent: "center", alignItems: "center"}}>
      <Icon name="arrow-up" size="large" color="white" />
      
      </View>
      </Card>
      {/* <ThemedText variant="heading">Custom Heading</ThemedText>
      <Badge>$50</Badge>
      <Button></Button>
      <Card>
        <ThemedText>Card</ThemedText>
      </Card>
      <Icon name="arrow-up" size="medium" />
      <Image />
      <ProgressBar /> */}
    </View>
    </Background>
  );
}
