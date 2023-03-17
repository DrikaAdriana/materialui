import { useEffect, useState} from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';


type TVTextFielProps =  TextFieldProps & {
    name: string
}

export const VTextField: React.FC<TVTextFielProps> = ( {name, ...rest}) => {//vai encapsular o componente do Material  TextField numa camada de UnForm / Esse componente só funcionará com Unform

  const {fieldName, registerField, defaultValue, error, clearError  } = useField(name);


  const [value, setValue] = useState(defaultValue || '');


  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: ( _,newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);


  return(
    <TextField
      {...rest}

      error={!!error}
      helperText={error}
      defaultValue={defaultValue}

      value={value}
      onChange={e => { setValue(e.target.value); rest.onChange?.(e); }}
      onKeyDown={(e) => { error && clearError(); rest.onKeyDown?.(e); }}
    />
  );
};