
import { Drawer, useTheme,  Avatar, Divider} from '@mui/material'
import { Box } from '@mui/system'


interface IMenuLateralProps {
    children: React.ReactNode
}


export const MenuLateral : React.FC <IMenuLateralProps>= ({children}) =>{
    const theme = useTheme()

    return(
      <>
         <Drawer variant='permanent'>
            <Box width={theme.spacing(28)} display='flex'>

                <Box width='100%' height={theme.spacing(20)} display='flex' alignItems='center' justifyContent='center'>
                    <Avatar 
                        sx={{height: theme.spacing(12), width: theme.spacing(12) }}
                        src="/static/images/avatar/1.jpg" 
                    />   
               </Box>

               <Divider/>

               <Box flex={1}>
                 
                 
               </Box>
           </Box>
         </Drawer>
    

        <Box height='100100vh' marginLeft={theme.spacing(28)}> 
           {children}
        </Box>
      </>
   )
}