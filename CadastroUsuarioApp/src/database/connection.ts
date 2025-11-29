import "reflect-metadata";
import { DataSource } from "typeorm";
import { UsuarioEntity } from "../entities/usuarioEntity";
import * as SQLiteExpo from 'expo-sqlite';
import { Platform } from 'react-native';

const databaseName = 'cadastro_usuario.db';

function openDatabase() {
  

  const expoOpen = (SQLiteExpo as any)?.openDatabase;
  if (typeof expoOpen === 'function') {
    return expoOpen(databaseName);
  }

  try {
    const SQLiteStorage = require('react-native-sqlite-storage');
    if (SQLiteStorage && typeof SQLiteStorage.openDatabase === 'function') {
      return SQLiteStorage.openDatabase({ name: databaseName, location: 'default' });
    }
  } catch (e) {
    
  }


  if (Platform.OS === 'web') {
    throw new Error('SQLite is not available on web. Run the app on iOS/Android simulator or device, or provide a web fallback.');
  }

  throw new Error('No suitable SQLite driver found. Make sure `expo-sqlite` is installed (or `react-native-sqlite-storage` on bare workflow) and available at runtime.');
}

export const AppDataSource = new DataSource({
  type: "react-native",
  database: databaseName,
  driver: openDatabase(),
  location: "default",
  entities: [UsuarioEntity],
  synchronize: true,
});
