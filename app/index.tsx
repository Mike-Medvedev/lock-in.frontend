import { Background, Badge, Button, Card, Icon, ProgressBar, ThemedText } from "@/components/ui";
import { useTheme } from "@/theme/themeContext";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
export default function Index() {
  const theme = useTheme()
  const router = useRouter()
  const ico =  <View style={{backgroundColor: "#1B8C59", width: 50, height: 50, borderRadius: theme.badge.borderRadius, justifyContent: "center", alignItems: "center"}}>
  <Icon name="arrow-up" size="large" color="white" />
  </View>
  return (
    <Background>
    <ScrollView
      style={{
        padding: theme.card.padding
      }}
    >
      {/* <Card styles={{marginTop: 0}}>
        <View style={{width: "100%"}}>
          <View style={{flexDirection: "row", gap: 16, marginBottom: 32}}>
            <View style={{flex: 1}}>
            <ThemedText variant="secondary">Total Balance</ThemedText>
            <ThemedText variant="title">$156.40</ThemedText>
            </View>
            <Feather name="arrow-up-right" size={24} color="grey" />
          </View>

          
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
      <Button left={<Icon name="add" color="white"/>}  title="Add Funds"/>
      <Button variant="outlined" title="Withdraw" left={<Feather name="arrow-down-left" size={16} color="grey" />}/>
      </View>
          
          
      </View>
      
      </Card> */}
      <View style={{flexDirection: "row"}}>
      <View style={{flex: 1}}>
        <ThemedText variant="title">Active Commitments</ThemedText>
        <ThemedText variant="secondary">Keep up the momentum</ThemedText>
      </View>
        <ThemedText styles={{alignSelf: "center"}}variant="success">View All →</ThemedText>
      </View>
      
      
      {/** Commitment Card */}
      <ScrollView horizontal>
      {[1, 2].map( (num) => <Card pressable onPress={() => console.log('Card pressed!')} styles={{marginRight: 20}} key={num}>
        <View style={{width: "100%"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <View>
            <ThemedText variant="heading">Morning Run Challenge</ThemedText>
            <ThemedText variant="secondary">Running 4x day 2 weeks</ThemedText>
            </View>
            <View style={{alignSelf: "center"}}>
            <Badge>$50</Badge>
            </View>
            
          </View>

          <View style={{ marginTop: 24, marginBottom: 16, gap: 4}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <ThemedText  styles={{fontWeight: "bold"}} variant="secondary">Progress</ThemedText>
              <ThemedText styles={{fontWeight: "bold"}}>5/8</ThemedText>
            </View>
            <ProgressBar value={50}/>
          </View>
        
          <View style={{flexDirection: "row", gap: 8}}>
            <Feather name="calendar" size={16} color="grey" />
            <ThemedText styles={{flex: 1}} variant="secondary">6 days left</ThemedText>
            <ThemedText variant="success">+$10 bonus</ThemedText>
          </View>
        </View>
      </Card>)}
      </ScrollView>


      <Card variant="primary">
            <View style={{alignItems: "center", gap: 16}}>
              {/* <Button onPress={() => router.push("/createCommitment")} ><Icon name="add" size="large" color="white" /></Button>
     */}
              <ThemedText variant="heading">Ready for your next challenge?</ThemedText>
              <ThemedText variant="secondary">Set a new goal, put some money on the line, and watch yourself succeed.</ThemedText>
              <Button onPress={() => router.push("/createCommitment")} title="Create New Commitment" />
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
    </ScrollView>
    </Background>
  );
}
