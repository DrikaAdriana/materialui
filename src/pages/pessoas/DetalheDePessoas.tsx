import { useEffect, useState } from 'react';
import { Box , Grid,  LinearProgress,  Paper, Typography} from '@mui/material';
import { useParams, useNavigate} from 'react-router-dom';
import * as yup from 'yup';


import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import { VTextField, VForm, useVForm, IVFormErrors} from '../../shared/forms';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';



interface IFormData {
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({//S para validar os
  nomeCompleto: yup.string().required('Campo é obrigatório').min(3, 'O campo precisa ter no mínimo 3 caracteres.'),
  email: yup.string().required().email('Este não é um email válido'),
  cidadeId: yup.number().required( ),
});

export const DetalheDePessoas: React.FC = () => {
  const { formRef,  save, saveAndClose, isSaveAndClose} = useVForm();
  const { id = 'nova'} = useParams<'id'>();
  const navigate = useNavigate();
  
  

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
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        email: '',
        cidadeid: '',
      });
    }
  }, [id]);

  const handleSave = (dados:IFormData ) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          PessoasService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/pessoas');
                } else {
                  navigate(`/pessoas/detalhe/${result}`);
                }
              }
            });
        } else {
          PessoasService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/pessoas');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });
    
        formRef.current?.setErrors(validationErrors);
      });
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


          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/pessoas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
       
        />
      }
    >


      <VForm ref={formRef}onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

          <Grid container direction='column' padding={2} spacing={2}>

            {isLoading&& (
              <Grid item>
                <LinearProgress variant='indeterminate'/>
              </Grid>
            )}


            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                  fullWidth
                  name='nomeCompleto'
                  disabled={isLoading}
                  label = 'Nome completo'
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>
       
         
            <Grid container item direction='row' spacing={2}>
              <Grid item  xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                  fullWidth
                  name='email'
                  label = 'Email'
                  disabled = {isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item  xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                  fullWidth
                  name='cidadeId'
                  label = 'Cidade'
                  disabled = {isLoading}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
      

