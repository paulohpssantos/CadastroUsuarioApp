import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usuario = sqliteTable("usuario", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  telefone: text("telefone"),
  email: text("email").notNull(),
  senha: text("senha").notNull(),
});

export const endereco = sqliteTable("endereco", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuarioId").references(() => usuario.id).notNull(),
  cep: text("cep"),
  logradouro: text("logradouro"),
  numero: text("numero"),
  complemento: text("complemento"),
  bairro: text("bairro"),
  cidade: text("cidade"),
  uf: text("uf"),
});
