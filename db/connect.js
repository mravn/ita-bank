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

export default async function connect(delay = true) {
    try {
        const conn = new pg.Client(env);
        await conn.connect();
        await conn.query('select 1'); // test connection
        if (delay) {
            await introduceDelays(conn);
        }
        return conn;
    } catch (e) {
        console.error(`Failed to connect to ${env.database}`);
        process.exit(-1);
    }
}

async function introduceDelays(conn) {
    const q = conn.query;
    conn.query = async function() {
        logQuery(arguments);
        try {
            await delay();
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
    process.stdout.write(' [press enter]');
}

function delay() {
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
