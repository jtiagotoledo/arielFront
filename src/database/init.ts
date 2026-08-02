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

// 1. Ajustado para o SQLiteProvider no _layout.tsx
export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY CHECK (id=1),
            meta_ml INTEGER DEFAULT 2500,
            consumo_parcial INTEGER DEFAULT 0,
            hor_acordar INTEGER DEFAULT 7,
            hor_dormir INTEGER DEFAULT 20
        );

        INSERT OR IGNORE INTO profile (id, meta_ml, consumo_parcial, hor_acordar, hor_dormir)
        VALUES(1, 2500, 0, 7, 20);

        CREATE TABLE IF NOT EXISTS ingestao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qnt_ml INTEGER NOT NULL,
            horario TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log('Banco de dados arielDB inicializado');
}

// 2. Passamos o 'db' em vez de abrir um novo
export async function buscarIngestoes(db: SQLite.SQLiteDatabase): Promise<Ingestao[]> {
    const result = await db.getAllAsync<Ingestao>(`
           SELECT 
                id,
                qnt_ml,
                datetime(horario, '-3 hours') AS horario,
                (SELECT SUM(qnt_ml) FROM ingestao i2 WHERE date(i2.horario, '-3 hours') = date(ingestao.horario, '-3 hours')) AS total_dia
           FROM ingestao
           ORDER BY horario DESC;
    `);
    return result;
}

export async function addIngestao(db: SQLite.SQLiteDatabase, quantidadeIngerida: number) {
    await db.runAsync(
        'INSERT INTO ingestao (qnt_ml) VALUES (?);',
        [quantidadeIngerida] 
    );
}

export async function deletarIngestao(db: SQLite.SQLiteDatabase, id: number) {
    await db.runAsync(
        'DELETE FROM ingestao WHERE id = ?;',
        [id] 
    );
}

export async function buscarProfile(db: SQLite.SQLiteDatabase): Promise<Profile | null> {
    const consumoHoje = await db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(qnt_ml),0) AS total
        FROM ingestao
        WHERE date(horario, '-3 hours') = date('now','-3 hours');`
    );

    const totalHoje = consumoHoje?.total || 0;

    await db.runAsync(
        'UPDATE profile SET consumo_parcial = ? WHERE id=1;', [totalHoje]
    );

    const result = await db.getFirstAsync<Profile>(`
           SELECT * FROM profile WHERE id=1;
    `);
    return result;
}

export async function atualizarProfile(db: SQLite.SQLiteDatabase, meta_ml: number, hor_acordar: number, hor_dormir: number) {
    await db.runAsync(
        `UPDATE profile
         SET meta_ml = ?, hor_acordar = ?, hor_dormir = ?
         WHERE id = 1;`,
        [meta_ml, hor_acordar, hor_dormir] 
    );
}