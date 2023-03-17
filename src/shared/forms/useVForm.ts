
import { FormHandles } from '@unform/core';
import { useRef, useCallback} from 'react';

export const useVForm = () => {
  const formRef = useRef<FormHandles>(null);

  const isSavingAndClose = useRef(false);
  const isSavingAnNew = useRef(false);
  

  const handleSave = useCallback(() => {
    isSavingAndClose.current = false;
    isSavingAnNew.current = false;
    formRef.current?.submitForm();
  }, []);


  const handleSaveAndNew = useCallback(() => {
    isSavingAndClose.current = false;
    isSavingAnNew.current = true;
    formRef.current?.submitForm();
  }, []);


  const handleSaveAndClose = useCallback(() => {
    isSavingAndClose.current = true;
    isSavingAnNew.current = false;
    formRef.current?.submitForm();
  }, []);




  const handleIsSaveAndNew = useCallback(() => {
    return isSavingAnNew.current;
  }, []);


  const handleIsSaveAndClose = useCallback(() => {
    return isSavingAndClose.current;
  }, []);
   

  return { 
    formRef, 

    save: handleSave,
    saveAndNew: handleSaveAndNew,
    saveAndClose: handleSaveAndClose,

    isSaveAndNew: handleIsSaveAndNew,
    isSaveAndClose: handleIsSaveAndClose,
  };
};