import { useTheme } from "@/theme/themeContext"
import { View } from "react-native"
export default function Card({ children }: { children?: React.ReactNode }){
    const theme = useTheme()
    return <View style={{maxWidth: 400, backgroundColor: theme.card.background, 
        borderColor: theme.card.border, borderRadius: theme.card.radius, 
        padding: theme.card.padding, 
        margin: theme.card.margin,
        shadowColor: "black",
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.2
        }}>
            {children}
            </View>
}

