import { useMemo, useEffect, useState } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon } from '@mui/material';
import { useNavigate, useSearchParams} from 'react-router-dom';



import { IListagemPessoa, PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { UseDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';


export const ListagemDePessoas: React.FC  = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = UseDebounce();
  const navigate = useNavigate();
  const [rouws, setRows] = useState<IListagemPessoa[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);


  const pagina = useMemo(() => {
    return  Number(searchParams.get('pagina') || '1');
  }, [searchParams]);



  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      PessoasService.getAll(pagina, busca)
        .then((result) => {//nesse caso melhor o.then do que o .catch pq nesse result virá (TPessoasComTotalCount ou Error), traz a tipagem forte 
          setIsLoading(false);
          
          if(result instanceof Error){ // instancia de Error...
            alert (result.message);
          }else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data);
          }
        });
    });
  }, [busca, pagina]); 


  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja excluir?')) {
      PessoasService.deleteById(id)
        .then( result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Registro excluido com sucesso');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina 
      titulo= 'Listagem de pessoas'
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo='Nova'
          textoDaBusca={busca}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
          aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1'}, { replace: true})}
        />
      }
    >
      <TableContainer  component = {Paper} variant='outlined' sx={{m: 1, width: 'auto'}}> 
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Ações</TableCell>
              <TableCell>Nome completo</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rouws.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size='small' onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size='small' onClick={() => navigate(`/pessoas/detalhe/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.nomeCompleto}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          
          {totalCount === 0 && !isLoading &&  ( 
            <caption style={{textAlign:'center'}}>{Environment.LISTAGEM_VAZIA}</caption>
          )}


          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant= 'indeterminate'/>
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination 
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)} 
                    onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString()}, { replace: true})} 
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};