import { Box, Paper, useTheme, Icon, Button, Divider} from '@mui/material';

export const FerramentasDeDetalhe: React.FC = () => {
  const theme = useTheme();

  return (
    <Box  
      gap={1}
      marginX={1} 
      padding={1}
      paddingX={2}
      display='flex'
      alignItems='center'
      height={theme.spacing(5)}  
      component={Paper}
    >
      <Button
        color='primary'
        variant='contained'
        startIcon={<Icon>save</Icon>}
      >Salvar</Button>
      <Button
        color='primary'
        variant='outlined'
        startIcon={<Icon>save</Icon>}
      >Salvar e voltar</Button>
      <Button
        color='primary'
        variant='outlined'
        startIcon={<Icon>delete</Icon>}
      >Apagar</Button>
      <Button
        color='primary'
        variant='outlined'
        startIcon={<Icon>add</Icon>}
      >Novo</Button>

      <Divider variant='middle' orientation='vertical' />

      <Button
        color='primary'
        variant='outlined'
        startIcon={<Icon>arrow_back</Icon>}
      >VOLTAR</Button>
    </Box>
  );
};