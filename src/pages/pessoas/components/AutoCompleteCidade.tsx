import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { UseDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';

import { CidadesService } from '../../../shared/services/api/cidades/CidadesService';


type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteCidadeProps {
    isExternalLoading? : boolean;
}

export const AutoCompleteCidade: React.FC<IAutoCompleteCidadeProps> = ({ isExternalLoading = false}) => {
  
  const { fieldName, registerField, defaultValue, error, clearError } = useField('cidadeId');
  const { debounce} = UseDebounce();

  const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue); 

  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');
  
  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField,  fieldName, selectedId]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesService.getAll(1, busca)
        .then((result) => {//nesse caso melhor o.then do que o .catch pq nesse result virá (TCidadesComTotalCount ou Error), traz a tipagem forte 
          setIsLoading(false);
          
          if(result instanceof Error){ // instancia de Error...
            // alert (result.message);
          }else {
            console.log(result);

            setOpcoes(result.data.map(cidade => ({id: cidade.id, label: cidade.nome})));
          }
        });
    });
  }, [busca]);


  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
    if (!selectedOption) return null;
    
    return selectedOption;
  }, [selectedId, opcoes]);

  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opçoes'
      loadingText='Carregando...'

      disablePortal

      value={autoCompleteSelectedOption}
      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      popupIcon={isExternalLoading || isLoading ? <CircularProgress size={28}/> : undefined}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError();}}
      renderInput={(params) => (
        <TextField
          {...params}

          label="Cidade"
          error={!!error}
          helperText={error}
        />
      
      )}
    />
  );
};