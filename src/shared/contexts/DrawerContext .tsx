import { createContext, useCallback, useState,  useContext } from "react";




interface IDrawerContextData {
    isDrawerOpen: boolean;
    toggleDrawerOpen: () => void; //faz a troca dos temas acima 
}


const DrawerContext = createContext({} as IDrawerContextData)


export const useDrawerContext = () => {
    return useContext(DrawerContext)
}



interface IAppThemeProviderProps{
    children: React.ReactNode
    
}

export const DrawerProvider: React.FC<IAppThemeProviderProps> = ({children}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen )
}, [])



    return (
        <DrawerContext.Provider value={{ isDrawerOpen ,  toggleDrawerOpen }}>
            {children}
        </DrawerContext.Provider>
    )
}