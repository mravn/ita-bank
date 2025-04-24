import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const env = {
    host:     process.env.PG_HOST,
    port:     parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user:     process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl:      { rejectUnauthorized: false },
};

export async function connect() {
    try {
        const conn = new pg.Client(env);
        await conn.connect();
        await conn.query('select 1'); // test connection
        return conn;
    } catch (e) {
        console.error(`Failed to connect to ${env.database}`);
        process.exit(-1);
    }
}

export async function connectWithSuspension() {
    const conn = await connect()
    addSuspension(conn);
    return conn;
}

function addSuspension(conn) {
    const q = conn.query;
    conn.query = async function() {
        logQuery(arguments);
        try {
            await suspend();
            const result = await q.apply(conn, arguments);
            logResult(result);
            return result;
        } catch (e) {
            logError(e);
            throw e;
        }
    };
}

function logQuery(args) {
    process.stdout.write(args[0].replaceAll(/\$\d+/g, (p) => args[1][parseInt(p.substring(1)) - 1]));
}

function suspend() {
    process.stdout.write(' [press Enter]');
    process.stdin.resume();
    return new Promise((r) => process.stdin.once('data', () => {
        process.stdin.pause();
        r();
    }));
}

function logResult(result) {
    process.stdout.write('---> ');
    if (result.command === 'SELECT') {
        if (result.rowCount === 1) {
            console.log(result.rows[0]);
        } else {
            console.log(result.rows.length, 'rows');
        }
    } else {
        if (result.rowCount === null) {
            console.log(result.command);
        } else {
            console.log(result.command, result.rowCount);
        }
    }
}

function logError(error) {
    console.log('error');
}
