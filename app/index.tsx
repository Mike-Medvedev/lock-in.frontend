import { Background, Badge, Button, Card, Icon, ProgressBar, ThemedText } from "@/components/ui";
import { useTheme } from "@/theme/themeContext";
import { View } from "react-native";
export default function Index() {
  const theme = useTheme()

  const ico =  <View style={{backgroundColor: "#1B8C59", width: 50, height: 50, borderRadius: theme.badge.borderRadius, justifyContent: "center", alignItems: "center"}}>
  <Icon name="arrow-up" size="large" color="white" />
  </View>
  return (
    <Background>
    <View
      style={{
        flex: 1,
        padding: theme.card.padding
      }}
    >
      <View style={{flexDirection: "row", gap: "16"}}>
        {ico}
      <View>
      <ThemedText variant="title">Lock-In</ThemedText>
      <ThemedText variant="secondary">Stay Commited, earn rewards</ThemedText>
      </View>
      
      </View>
      
      <Card>
        <View style={{width: "100%"}}>
          <ThemedText variant="secondary">Your Balance</ThemedText>
          <ThemedText variant="title">$156.40</ThemedText>
      
          <Icon name="arrow-up-right-box-outline" size="large" />
          <Button></Button>
          <Button variant="outlined"></Button>
        </View>
      
      </Card>

      <ThemedText variant="title">Active Commitments</ThemedText>
      <ThemedText variant="secondary">Keep up the momentum</ThemedText>
      <ThemedText variant="success">View All →</ThemedText>

      <Card>
      <View style={{width: "100%"}}>
        <View style={{flexDirection: "row"}}>
          <View>
          <ThemedText variant="heading">Morning Run Challenge</ThemedText>
          <ThemedText variant="secondary">Running 4x per week for 2 weeks</ThemedText>
          </View>
          <Badge>$50</Badge>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <ThemedText  styles={{fontWeight: "bold"}} variant="secondary">Progress</ThemedText>
        <ThemedText styles={{fontWeight: "bold"}}>5/8</ThemedText>
        </View>
        <ProgressBar value={50}/>
        
        <View style={{flexDirection: "row", justifyContent: "space-around"}}>
          <Icon name="calendar"/>
          <ThemedText variant="secondary">6 days left</ThemedText>
          <ThemedText variant="success">+$10 bonus</ThemedText>
        </View>
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
