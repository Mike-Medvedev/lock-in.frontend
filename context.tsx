import { createContext, ReactNode, useContext, useState } from "react"

const context = createContext<any>(undefined)

export function useMyContext(){
const c = useContext(context)
if(!c){
    throw new Error("useMyContext must be called within MyContextProvider")
}
return c
}

export function MyContextProvider({children}: {children: ReactNode}){
    const [goals, setGoals] = useState({
        activity: "",
        frequency: "",
        duration: "",
        stake: ""
    })
    
    const state = {
        goals,
        setGoals
    }
    return <context.Provider value={state}>
        {children}
    </context.Provider>
}