// nesse caso especifico é CRUD
// tratando os dados e despois disponibilizando  para uso já tratados 
// esta configuração abaixo bote ter outros metodos permitidos , depende da necessidade do projeto
// Ex: Se fosse updateUser = poderia ter updateById, ou updateByUserName etc...

import { Environment } from '../../../environment';
import {Api} from '../axios-config';


export interface IListagemPessoa {
    id: number;
    email: string;
    cidadeId: number;
    nomeCompleto: string;
}

export interface IDetalhePessoa {
    id: number;
    email: string;
    cidadeId: number;
    nomeCompleto: string;
}

type TPessoasComTotalCount = {
    data: IListagemPessoa[],
    totalCount: number,

}

const getAll = async ( page = 1, filter = '' ): Promise<TPessoasComTotalCount | Error> => {
  try {
    const urlRelativa = `/pessoas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);//headers é retornado por padrão pelo json-server , informando o total de registros no banco de dados

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),// precisei converter pra Number
      };
    }

    return new Error('Erro ao listar os registros');
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao listar os registros');   
  }
};


const getById = async (id: number): Promise<IDetalhePessoa | Error> => {
  try {
    const { data } = await Api.get(`/pessoas/$${id}`);
    
    if (data) {
      return data;
    }
    
    return new Error('Erro ao consultar os registro');
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao consultar oo registro');   
  }
};



const create = async (dados: Omit<IDetalhePessoa,  'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalhePessoa>('/pessoas', dados);
        
    if (data) {
      return data.id;
    }
        
    return new Error('Erro ao criar os registro');
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao criar oo registro');   
  }
};

const updateById = async (id: number, dados:IDetalhePessoa): Promise<void | Error> => {
  try {
    await Api.put(`/pessoas/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao atualizar o registro');   
  }
};


const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/pessoas/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao apagar oo registro');   
  }
};


export const PessoasService = {
  getAll,
  getById,
  create,
  updateById, 
  deleteById,
};