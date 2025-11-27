import { EnderecoRepository } from "../repositories/enderecoRepository";
import { EnderecoEntity } from '../entities/enderecoEntity';

const repo = new EnderecoRepository();

export const EnderecoService = {

  create: async (payload: Partial<EnderecoEntity>): Promise<EnderecoEntity> => {
    
    const {
      logradouro = '',
      numero = '',
      bairro = '',
      cep = '',
      uf = '',
      cidade = '',
    } = payload;

    
    const usuarioId = (payload as any).usuarioId ?? undefined;

    return repo.create(logradouro, numero, bairro, cep, uf, cidade, usuarioId);
  },

  list: async () => repo.findAll(),
  
  remove: async (id: number) => repo.delete(id),
};
