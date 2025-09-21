import { useTheme } from "@/theme/themeContext"
import { Pressable, View } from "react-native"
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes"

interface CardProps{
    children?: React.ReactNode,
    variant?: "primary",
    styles?: ViewStyle,
    pressable?: boolean,
    onPress?: () => void
}

export default function Card({children, variant, styles, pressable, onPress}: CardProps){
    const theme = useTheme()

    const base = {
        maxWidth: 500, backgroundColor: theme.card.background, 
        borderColor: theme.card.border, borderRadius: theme.card.radius, 
        borderWidth: theme.card.borderWidth,
        padding: theme.card.padding, 
        marginVertical: theme.card.margin,
        shadowColor: "black",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2
    }

   

    const cardStyle = [base, styles, {backgroundColor: variant === "primary"
         ? theme.card.successBackgroundColor 
         : theme.card.background,
         borderColor: variant === "primary"
         ? theme.card.successBorderColor 
         : theme.card.border }]

    if (pressable && onPress) {
        return (
            <Pressable style={({pressed}) => [cardStyle, {opacity: pressed ? 0.7 : 1}]} onPress={onPress}>
                {children}
            </Pressable>
        )
    }

    return <View style={cardStyle}>
            {children}
            </View>
}

