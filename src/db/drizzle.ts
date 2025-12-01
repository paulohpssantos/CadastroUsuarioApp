import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

const _open: any = (SQLite as any).openDatabase ?? (SQLite as any).openDatabaseSync ?? ((name: string) => (SQLite as any).openDatabase?.(name));
const expoDb = _open("app.db") as any;

export const db = drizzle(expoDb);

export const initDb = async () => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT NOT NULL,
      senha TEXT NOT NULL
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS endereco (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER NOT NULL,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      complemento TEXT,
      bairro TEXT,
      cidade TEXT,
      uf TEXT,
      FOREIGN KEY(usuarioId) REFERENCES usuario(id)
    );
  `);
};
