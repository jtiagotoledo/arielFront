import * as SQLite from 'expo-sqlite';

export interface Ingestao {
    id: number;
    qnt_ml: number;
    horario: string;
}

export async function initDatabase() {
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    await db.execAsync(`

        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meta_ml INTEGER
        );

        CREATE TABLE IF NOT EXISTS ingestao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qnt_ml INTEGER NOT NULL,
            horario TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log('banco de dados arielDB criado com sucesso');
    await buscarIngestoes();
    return db;
}

export async function buscarIngestoes():Promise<Ingestao[]> {
    const db = await SQLite.openDatabaseAsync('arielDB.db');
    const result = await db.getAllAsync<Ingestao>(
           'SELECT * FROM ingestao;'
    );
    console.log('buscar ingestões: ', result);
    return result;
}

export async function addIngestao(quantidadeIngerida:number) {
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    await db.runAsync(
        'INSERT INTO ingestao (qnt_ml) VALUES (?);',
        [quantidadeIngerida] 
    );
}