
import { Drawer, useTheme,  Avatar, Divider, List, ListItemButton, Icon, ListItemIcon, ListItemText, useMediaQuery} from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate, useResolvedPath, useMatch } from 'react-router-dom';

import { useDrawerContext } from '../../contexts';


interface IMenuLateralProps {
  children: React.ReactNode
}


interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick: (() => void) | undefined;
}


const ListItemLink: React.FC<IListItemLinkProps> = ({to, icon, label, onClick }) => {
  const navigate = useNavigate();


  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname,  end: false});


  const handleClick = () => {
    navigate(to);
    onClick?.();
  };
 

  return(
    <ListItemButton  selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label}/>
    </ListItemButton>
  );
};


export const MenuLateral : React.FC <IMenuLateralProps>= ({children}) =>{
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();



  return(
    <>
      <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
        <Box width={theme.spacing(28)} height='100%'display='flex' flexDirection={'column'}>

          <Box width='100%' height={theme.spacing(20)} display='flex' alignItems='center' justifyContent='center'>
            <Avatar 
              sx={{height: theme.spacing(12), width: theme.spacing(12) }}
              src="/static/images/avatar/1.jpg" 
            />   
          </Box>

          <Divider/>

          <Box flex={1}>
            <List component="nav">
              {drawerOptions.map(drawerOptions =>(
                <ListItemLink
                  key={drawerOptions.path}
                  icon={drawerOptions.icon}
                  to={drawerOptions.path}
                  label= {drawerOptions.label}
                  onClick={smDown ? toggleDrawerOpen : undefined}
                />
              ))}
            </List>
          </Box>

        </Box>
      </Drawer>

      <Box height='100vh' marginLeft={smDown ? 0 : theme.spacing(28)}> 
        {children}
      </Box>
    </>
  );
};