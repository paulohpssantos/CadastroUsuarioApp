import { UsuarioRepository } from "../repositories/usuarioRepository";
import { EnderecoEntity } from "../entities/enderecoEntity";

const repo = new UsuarioRepository();

export const UsuarioService = {
  create: async (nome: string, telefone: string, senha: string, email: string, enderecos?: Partial<EnderecoEntity>[]) => 
    repo.create(nome, telefone, senha, email, enderecos),
  list: async () => repo.findAll(),
  remove: async (id: number) => repo.delete(id),
};
