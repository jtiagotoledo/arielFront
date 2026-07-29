import * as SQLite from 'expo-sqlite';

export async function initDatabase() {  
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    await db.execAsync(`

        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meta 
        );

        CREATE TABLE IF NOT EXISTS ingestao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            horario DEFAULT CURRENT_TIMESTAMP
        );
    `);

    return db;

}