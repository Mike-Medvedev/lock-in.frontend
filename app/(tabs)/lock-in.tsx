import { useMyContext } from "@/context";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
type Activity = "gym" | "run"
type Step = "activity" | "frequency" | "stake"
export default function LockInPage(){
    const {goals, setGoals} = useMyContext()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [gymButton, setGymButton] = useState<boolean>(false)
    const [step, setStep] = useState<Step>("activity")

    const activityStep = <><Text style={styles.title}>Select your activity!</Text>
        <View style={styles.squareContainer} >
        
        <Pressable onPress={() => {setGoals((prev: any) =>({...prev, activity:"gym"})); setGymButton(prev => !prev); setStep("frequency")}} style={({pressed}) => [
             {
                opacity: pressed ? 0.7 : 1,
              },
            styles.square
          ]}>
            <Text style={styles.text}>Gym</Text>
        </Pressable>
        <Pressable onPress={() => {setGoals((prev: any) =>({...prev, activity:"run"})); setStep("frequency"); setGymButton(prev => !prev)}} style={({pressed}) => [
             {
                opacity: pressed ? 0.7 : 1,
              },
            styles.square
          ]}>
        <Text style={styles.text}>Run</Text>
        </Pressable>
    </View></>
    
    const frequencyStep = <>

    <View style={{flex: 1, margin: 10}}>
        <Pressable onPress={() => setStep("activity")}>
            <Text style={styles.title}>
                🔙
            </Text>
        </Pressable>
        <View>
        <Text style={styles.title}>Select Your Duration</Text>
    <Picker
  selectedValue={goals.duration || "2"}
  onValueChange={(itemValue, itemIndex) =>
    setGoals((prev: any) => ({...prev, duration: itemValue}))
  }>
  <Picker.Item label="2 weeks" value="2" />
  <Picker.Item label="3 weeks" value="3" />
  <Picker.Item label="1 Month" value="4" />
</Picker>
        </View>
        <View>
        <Text style={styles.title}>Select Your Frequency</Text>
    <Picker
  selectedValue={goals.frequency || "3"}
  onValueChange={(itemValue, itemIndex) =>
    setGoals((prev: any) => ({...prev, frequency: itemValue}))
  }>
  <Picker.Item label="3x Week" value="3" />
  <Picker.Item label="4x Week" value="4" />
  <Picker.Item label="5x Week" value="5" />
  <Picker.Item label="6x Week" value="6" />
  <Picker.Item label="7x Week" value="7" />
</Picker>
        </View>
       

   <Pressable onPress={() => setStep("stake")} style={({pressed}) => [{borderWidth: 1, width: 100, marginTop: 20, padding: 10, borderRadius: 6, alignSelf: "center", opacity: pressed ? 0.5 : 1}]}>
    <Text style={{textAlign: "center", color:"black", fontSize: 20}}>
        Next
        </Text>
    </Pressable>
    </View>
    
    </>
    const stakeStep = <>
    <View style={{padding: 10, alignItems: "center"}}>
        <Pressable onPress={() => setStep("frequency")}>
            <Text style={styles.title}>🔙</Text>
            </Pressable>
        
        <Text style={styles.title}>
            Enter your Stake
        </Text>
        <View style={styles.stakeInputContainer}>
            <Text style={{fontSize: 30, color: "grey"}}>$</Text>
        <TextInput style={styles.stakeInput} maxLength={5} keyboardType="number-pad" inputMode="decimal" placeholder="0.00" value={goals.stake} onChangeText={(val) => setGoals((prev: any) => ({...prev, stake: val}))}></TextInput>

        </View>
        <Pressable onPress={() =>{ setLoading(true);
            setTimeout(() => {router.push("/")}, 1000)
        }} style={({pressed}) => [{borderWidth: 1, width: 100, marginTop: 50, padding: 10, borderRadius: 6, alignSelf: "center", opacity: pressed ? 0.5 : 1}]}>
    <Text style={{textAlign: "center", color:"black", fontSize: 20}}>
        Lock-In
        </Text>
    </Pressable>
    </View>
    </>

  function render(step: Step){
    switch(step){
        case "activity": 
            return activityStep
        case "frequency":
            return frequencyStep
        case "stake":
            return stakeStep

    }
  }
  if(loading) return <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
    <Text style={styles.title}>Locking In</Text>
    <ActivityIndicator size="large" />
  </View>
    
    return <View style={styles.container}>
        {render(step)}
    </View>
}
const styles = StyleSheet.create({
    container: {flex: 1},
    squareContainer: {
        flex: 1,
        padding: 8,
        opacity: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap:5
    },

    square: {
        width: 100,
        height: 100,
        backgroundColor: "black",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign:"center", margin: 10, fontSize: 32
    },
    text: {
        color: "#FFFFFF"
    },
    stakeInputContainer: {
        width: 120,
        borderBottomWidth: 1,
        borderColor: "grey",
        flexDirection: "row",
        overflow: "hidden"
    },
    stakeInput: {
        fontSize: 30,
        width: "100%",
        letterSpacing: 3
    }

})