import { useEffect, useState } from "react";

import { EnderecoEntity } from "../src/entities/enderecoEntity";
import { EnderecoService } from "../src/services/enderecoService";


export function useEnderecos() {
  const [enderecos, setEnderecos] = useState<EnderecoEntity[]>([]);
  async function load() {
    const data = await EnderecoService.list();
    setEnderecos(data);
  }

  async function add(logradouro: string, numero: string, bairro: string, cep: string, uf: string, cidade: string, usuarioId?: number | null) {
    await EnderecoService.create(logradouro, numero, bairro, cep, uf, cidade, usuarioId);
    await load();
  }

  async function remove(id: number) {
    await EnderecoService.remove(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return { enderecos, add, remove };
}
