import * as SQLite from 'expo-sqlite';

export interface Ingestao {
    id: number;
    qnt_ml: number;
    total_dia: number;
    horario: string;
}

export interface Profile {
    id: number;
    meta_ml: number;
    consumo_parcial: number;
    hor_acordar: number;
    hor_dormir: number;
}

export async function initDatabase() {
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    await db.execAsync(`

        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY CHECK (ID=1),
            meta_ml INTEGER DEFAULT 2500,
            consumo_parcial INTEGER DEFAULT 0,
            hor_acordar INTEGER DEFAULT 7,
            hor_dormir INTEGER DEFAULT 20
        );

        INSERT OR IGNORE INTO profile (id, meta_ml, consumo_parcial, hor_acordar, hor_dormir)
        VALUES(1,2500,0,7,20);

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
    const result = await db.getAllAsync<Ingestao>(`
           SELECT 
                id,
                qnt_ml,
                datetime(horario, '-3 hours') AS horario,
                SUM(qnt_ml) OVER (
                    PARTITION BY date(horario, '-3 hours')
                ) AS total_dia
           FROM ingestao
           ORDER BY horario DESC;
    `);
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

export async function deletarIngestao(id:number) {
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    await db.runAsync(
        'DELETE FROM ingestao WHERE id = ?;',
        [id] 
    );
    await buscarIngestoes();
    console.log(`Ingestão id ${id} deletada`);
}

export async function buscarProfile():Promise<Profile | null> {
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    const consumoHoje = await db.getFirstAsync<{total:number}>(
        `SELECT COALESCE(SUM(qnt_ml),0) AS total
        FROM ingestao
        WHERE date(horario, '-3 hours') = date('now','-3 hours');`
    );

    const totalHoje = consumoHoje?.total || 0;
    console.log('totalHoje', totalHoje);
    

    await db.runAsync(
        'UPDATE profile SET consumo_parcial = ? WHERE id=1;',[totalHoje]
    );

    const result = await db.getFirstAsync<Profile>(`
           SELECT * FROM profile WHERE id=1;
    `);
    console.log('buscar profile: ', result);
    return result;
}

export async function atualizarProfile(meta_ml:number, hor_acordar:number, hor_dormir:number) {
    const db = await SQLite.openDatabaseAsync('arielDB.db');

    await db.runAsync(
        `UPDATE profile
         SET meta_ml = ?, hor_acordar = ?, hor_dormir = ?
         WHERE id = 1;`,
        [meta_ml,hor_acordar,hor_dormir] 
    );
    console.log('profile atualizado');
}