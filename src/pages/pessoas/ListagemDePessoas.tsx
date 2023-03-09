import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';


import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import { UseDebounce } from '../../shared/hooks';

export const ListagemDePessoas: React.FC  = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = UseDebounce(3000, false);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);


  useEffect(() => {

    debounce(() => {
      PessoasService.getAll(1, busca)
        .then((result) => {//nesse caso melhor o.then do que o .catch pq nesse result virá (TPessoasComTotalCount ou Error), traz a tipagem forte 
          if(result instanceof Error){ // instancia de Error...
            alert (result.message);
          }else {
            console.log(result);
          }
        });
    });
  }, [busca]); 


  return (
    <LayoutBaseDePagina 
      titulo= 'Listagem de pessoas'
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo='Nova'
          textoDaBusca={busca}
          aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto}, { replace: true})}
        />
      }
    >
    </LayoutBaseDePagina>
  );
};