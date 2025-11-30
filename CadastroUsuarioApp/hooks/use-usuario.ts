import { useEffect, useState } from "react";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario
} from "../src/services/usuarioService";

import {
  criarEndereco,
  buscarEnderecoPorUsuario,
  atualizarEndereco,
  deletarEndereco
} from "../src/services/enderecoService";

import { Usuario } from "../src/models/usuario";
import { Endereco } from "../src/models/endereco";

export function useUsuario() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    setCarregando(true);

    const lista = await listarUsuarios();

    const resultado = [];
    for (const u of lista) {
      const end = await buscarEnderecoPorUsuario(u.id!);
      resultado.push({ usuario: u, endereco: end });
    }

    setUsuarios(resultado);
    setCarregando(false);
  };

  const adicionar = async (usuario: Usuario, endereco: Endereco) => {
    await criarUsuario(usuario);

    const lista = await listarUsuarios();
    const ultimo = lista[lista.length - 1];

    if (!ultimo || typeof ultimo.id !== 'number') {
      throw new Error('Não foi possível localizar o usuário criado');
    }

    const usuarioId: number = ultimo.id;

    await criarEndereco({
      ...endereco,
      usuarioId
    });

    await carregar();
  };

  const atualizar = async (id: number, usuarioData: Usuario, enderecoData: Endereco) => {
    await atualizarUsuario(id, usuarioData);

    const end = await buscarEnderecoPorUsuario(id);
    if (end) {
      await atualizarEndereco(end.id!, enderecoData);
    }

    await carregar();
  };

  const remover = async (id: number) => {
    const end = await buscarEnderecoPorUsuario(id);
    if (end) {
      await deletarEndereco(end.id!);
    }
    await deletarUsuario(id);
    await carregar();
  };

  return {
    usuarios,
    carregando,
    adicionar,
    atualizar,
    remover,
    recarregar: carregar
  };
}
