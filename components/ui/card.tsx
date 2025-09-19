import { useTheme } from "@/theme/themeContext"
import { View } from "react-native"

interface CardProps{
    children?: React.ReactNode,
    variant?: "primary"
}

export default function Card({children, variant}: CardProps){
    const theme = useTheme()

    const base = {
        maxWidth: 400, backgroundColor: theme.card.background, 
        borderColor: theme.card.border, borderRadius: theme.card.radius, 
        borderWidth: theme.card.borderWidth,
        padding: theme.card.padding, 
        marginVertical: theme.card.margin,
        shadowColor: "black",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2
    }

   

    return <View style={[base, {backgroundColor: variant === "primary"
         ? theme.card.successBackgroundColor 
         : theme.card.background,
         borderColor: variant === "primary"
         ? theme.card.successBorderColor 
         : theme.card.border }]}>
            {children}
            </View>
}

