import { useEffect, useState } from "react";

import { UsuarioEntity } from "../src/entities/usuarioEntity";
import { UsuarioService } from "../src/services/usuarioService";



export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function load() {
    setLoading(true);
    try {
      const data = await UsuarioService.list();
      setUsuarios(data);
    } finally {
      setLoading(false);
    }
  }

  async function add(payload: Partial<UsuarioEntity> ) {
        try {
            const novo = await UsuarioService.create(payload);
            await load();
            return novo;
        } catch (err) {
            console.error('Erro ao salvar usuario', err);
            throw err;
        }
    }


  async function remove(id: number) {
    await UsuarioService.remove(id);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return { usuarios, add, remove, load, loading };
}
