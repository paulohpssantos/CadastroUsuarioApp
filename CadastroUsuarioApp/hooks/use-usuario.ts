import { useEffect, useState } from "react";

import { UsuarioEntity } from "../src/entities/usuarioEntity";
import { EnderecoEntity } from "../src/entities/enderecoEntity";
import { UsuarioService } from "../src/services/usuarioService";
import { EnderecoService } from "../src/services/enderecoService";


export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioEntity[]>([]);

  async function load() {
    const data = await UsuarioService.list();
    setUsuarios(data);
  }

  async function add(nome: string, telefone: string, senha: string, email: string, enderecos?: Partial<EnderecoEntity>[]) {

    await UsuarioService.create(nome, telefone, senha, email, enderecos);
    await load();
  }

  async function remove(id: number) {
    await UsuarioService.remove(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return { usuarios, add, remove };
}
