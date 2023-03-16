import { useParams, useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FormHandles} from '@unform/core';
import { Box , Grid,  Paper} from '@mui/material';
import { Form } from '@unform/web';

import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { VTextField } from '../../shared/forms';


interface IFormData {
  email: string;
  nomeCompleto: string;
  cidadeId: number;
}

export const DetalheDePessoas: React.FC = () => {
  const { id = 'nova'} = useParams<'id'>();
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);


  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');


  useEffect (() => {
    if(id !== 'nova') {
      setIsLoading(true);

      PessoasService.getById(Number(id))  
        .then((result) => {
          setIsLoading(false);
          console.log(id);
          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas');
          } else {
            setNome(result.nomeCompleto);
            formRef.current?.setData(result);
          }
        });
    }
  }, [id]);

  const handleSave = (dados:IFormData ) => {
    setIsLoading(true);
    if (id === 'nova') {
      PessoasService
        .create(dados)
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            navigate(`/pessoas/detalhe/${result}`);
          }      
        });
    }else{
      PessoasService
        .updateById(Number(id), {id: Number(id),...dados})
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          }      
        });
    }
  };   
  

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja excluir?')) {
      PessoasService.deleteById(id)
        .then( result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro excluido com sucesso');
            navigate('/pessoas');
          }
        });
    }
  };

  return (
    <LayoutBaseDePagina 
      titulo={id === 'nova' ? 'Nova pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
        />
      }
    >


      <Form ref={formRef}onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

          <Grid container direction='column' padding={2} spacing={2}>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={8}>
                <VTextField 
                  fullWidth
                  name='nomeCompleto'
                  placeholder = 'Nome completo'
                />
              </Grid>
            </Grid>
       
         
            <Grid container item direction='row' spacing={2}>
              <Grid item>
                <VTextField 
                  fullWidth
                  name='email'
                  placeholder = 'Email'/>
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item>
                <VTextField 
                  fullWidth
                  name='cidadeId'
                  placeholder = 'Cidade Id'/>
              </Grid>
            </Grid>

          </Grid>
        </Box>
      </Form>
    </LayoutBaseDePagina>
  );
};

