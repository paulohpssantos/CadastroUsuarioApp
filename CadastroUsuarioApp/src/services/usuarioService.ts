import { db } from "../db/drizzle";
import { usuario } from "../db/schemas";
import { eq } from "drizzle-orm";
import { Usuario } from "../models/usuario";

export const criarUsuario = async (data: Usuario) => {
  await db.insert(usuario).values(data);
};

export const listarUsuarios = async (): Promise<Usuario[]> => {
  return await db.select().from(usuario);
};

export const buscarUsuario = async (id: number): Promise<Usuario | null> => {
  const result = await db.select().from(usuario).where(eq(usuario.id, id));
  return result[0] ?? null;
};

export const atualizarUsuario = async (id: number, data: Usuario) => {
  await db.update(usuario).set(data).where(eq(usuario.id, id));
};

export const deletarUsuario = async (id: number) => {
  await db.delete(usuario).where(eq(usuario.id, id));
};
