import { createContext, useCallback, useState, useMemo, useContext } from 'react';
import { DarkTheme, LightTheme } from './../themes';
import { Box } from '@mui/system';
import { ThemeProvider } from '@mui/material/styles';


interface IThemeContextData {
    themeName:'light'| 'dark';
    toggleTheme: () => void; //faz a troca dos temas acima 
}



const ThemeContext = createContext({} as IThemeContextData);


export const useAppThemeContext = () => {
  return useContext(ThemeContext);
};



interface IAppThemeProviderProps{
    children: React.ReactNode
    
}

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({children}) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(()=>{
    setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');
  }, []);


  const theme = useMemo(() => {
    if (themeName === 'light') return LightTheme;

    return DarkTheme;
  }, [themeName]);



  return (
    <ThemeContext.Provider value={{themeName, toggleTheme}}>
      <ThemeProvider theme={theme}>   
        <Box width="100vW" height="100vh" bgcolor={theme.palette.background.default}>
          {children}
        </Box>
      </ThemeProvider> 
    </ThemeContext.Provider>
  );
};