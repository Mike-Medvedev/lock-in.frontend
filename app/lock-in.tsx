import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
type Activity = "gym" | "run"
type Step = "activity" | "frequency" | "stake"
export default function LockInPage(){
    const [activity, setActivity] = useState<Activity | undefined>(undefined)
    const [gymButton, setGymButton] = useState<boolean>(false)
    const [step, setStep] = useState<Step>("activity")
    const activityStep = <><Text style={styles.title}>Select your activity!</Text>
        <View style={styles.squareContainer} >
        
        <Pressable onPress={() => {setActivity("gym"); setGymButton(prev => !prev); setStep("frequency")}} style={({pressed}) => [
             {
                opacity: pressed ? 0.7 : 1,
              },
            styles.square
          ]}>
            <Text style={styles.text}>Gym</Text>
        </Pressable>
        <Pressable onPress={() => {setActivity("run"); setStep("frequency"); setGymButton(prev => !prev)}} style={({pressed}) => [
             {
                opacity: pressed ? 0.7 : 1,
              },
            styles.square
          ]}>
        <Text style={styles.text}>Run</Text>
        </Pressable>
    </View></>
    
    const frequencyStep = <>
    <View style={{flex: 1, margin: 10, alignItems: "center"}}>
    <Pressable onPress={() => setStep("activity")}>
        <Text style={{color: "red"}}>🔙</Text>
    </Pressable>
    <Pressable>
        <Text style={styles.title}>Select your frequency</Text>
   
    </Pressable>
    </View>
    
    </>
    const stakeStep = <></>

    const stepView = {
        activity: activityStep,
        frequency: frequencyStep,
        stake: stakeStep,
      }[step] ?? null;
    return <View style={styles.container}>
        {stepView}
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
    }
})