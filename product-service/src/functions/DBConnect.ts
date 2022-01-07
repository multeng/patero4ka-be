import {Pool, Client} from 'pg';

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD} = process.env;

const DBOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
};

export const DBConnect = async (): Client => {
    let pool;

    if (!pool) {
        pool = new Pool(DBOptions);
    }
    return await pool.connect();
}