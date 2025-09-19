import type { Theme } from "@/theme/theme"
import theme from "@/theme/theme"
import { createContext, useContext } from "react"
const ThemeContext = createContext<Theme | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if(!context){
        throw new Error("Error hook must be used within ThemeProvided")
    }
    return context
}
export function ThemeProvider({ children }: { children: React.ReactNode }){
    return <ThemeContext.Provider value={theme}>
{children}
    </ThemeContext.Provider>
}