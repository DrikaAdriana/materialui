//Esse interceptor recebe um merror por parâmetro


import { AxiosError } from 'axios';

export const errorInterceptor = (error: AxiosError) => { 
  if(error.message === 'Network Error') {
    return Promise.reject(new Error('Erro de conexão'));
  }

  return Promise.reject(error);

};