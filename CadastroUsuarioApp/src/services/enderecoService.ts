import { db } from "../db/drizzle";
import { endereco } from "../db/schemas";
import { eq } from "drizzle-orm";
import { Endereco } from "../models/endereco";

export const criarEndereco = async (data: Endereco) => {
  await db.insert(endereco).values(data);
};

export const buscarEnderecoPorUsuario = async (usuarioId: number): Promise<Endereco | null> => {
  const result = await db.select().from(endereco).where(eq(endereco.usuarioId, usuarioId));
  return result[0] ?? null;
};

export const atualizarEndereco = async (id: number, data: Endereco) => {
  await db.update(endereco).set(data).where(eq(endereco.id, id));
};

export const deletarEndereco = async (id: number) => {
  await db.delete(endereco).where(eq(endereco.id, id));
};
