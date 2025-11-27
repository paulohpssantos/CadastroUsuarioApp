import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../entities/usuarioEntity";
import { Endereco } from "../entities/enderecoEntity";
import * as SQLite from "expo-sqlite";

const databaseName = "cadastro_usuario.db";

function openDatabase() {
  return SQLite.openDatabase(databaseName);
}

export const AppDataSource = new DataSource({
  type: "react-native",
  database: databaseName,
  driver: openDatabase(),
  location: "default",
  entities: [Usuario, Endereco],
  synchronize: true, 
});
