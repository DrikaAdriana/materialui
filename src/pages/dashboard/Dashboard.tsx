import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useState, useEffect} from 'react';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { CidadesService } from '../../shared/services/api/cidades/CidadesService';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';

export const Dashboard = () => {
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [totalCountCidades, setTotalCountCidades] = useState(0);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);


  useEffect(() => {
    setIsLoadingCidades(true); 
    setIsLoadingPessoas(true);
  
    CidadesService.getAll(1)
      .then((result) => {//nesse caso melhor o.then do que o .catch pq nesse result virá (TCidadesComTotalCount ou Error), traz a tipagem forte 
        setIsLoadingCidades(false);
            
        if(result instanceof Error){ // instancia de Error...
          alert (result.message);
        }else {
          setTotalCountCidades(result.totalCount);
        }
      });
    PessoasService.getAll(1)
      .then((result) => {//nesse caso melhor o.then do que o .catch pq nesse result virá (TCidadesComTotalCount ou Error), traz a tipagem forte 
        setIsLoadingPessoas(false);
            
        if(result instanceof Error){ // instancia de Error...
          alert (result.message);
        }else {
          setTotalCountPessoas(result.totalCount);
        }
      });
  }, []); 


  return( 
    <LayoutBaseDePagina 
      titulo='Página inicial' 
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false}/>}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total de Pessoas
                  </Typography>
       
                  <Box padding={6}display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingPessoas &&(
                      <Typography variant='h1'>
                        {totalCountPessoas}
                      </Typography>
                    )}
                    {isLoadingPessoas && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total de Cidades
                  </Typography>
       
                  <Box padding={6}display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingCidades &&(
                      <Typography variant='h1'>
                        {totalCountCidades}
                      </Typography>
                    )}
                    {isLoadingCidades && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};

