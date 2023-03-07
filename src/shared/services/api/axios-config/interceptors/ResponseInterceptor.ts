import { AxiosResponse } from 'axios';

export const responseInterceptor = (response: AxiosResponse) => {
  return response;// caso queira fazer algum tipo de tratamento padrao mas não é regra
};