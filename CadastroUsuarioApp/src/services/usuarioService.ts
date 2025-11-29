import { UsuarioRepository } from "../repositories/usuarioRepository";
import { EnderecoEntity } from "../entities/enderecoEntity";
import { UsuarioEntity } from "../entities/usuarioEntity";

const repo = new UsuarioRepository();

export const UsuarioService = {
    create: async (payload: Partial<UsuarioEntity> ) => {
        return repo.create(payload);
    },

    list: async () => repo.findAll(),
    remove: async (id: number) => repo.delete(id),
    update: async (id: number, patch: Partial<UsuarioEntity>) => repo.update ? repo.update(id, patch) : null,
};
