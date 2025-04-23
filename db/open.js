import connect from './connect.js';

if (process.argv.length !== 3) {
    console.error('Usage: npm run open <account>')
    process.exit(1);
}

const conn = await connect();
try {
    const accountId = parseInt(process.argv[2]);
    await openAccount(accountId);
    console.log('Success.');
} catch (e) {
    console.error('Opening account failed:', e.message);
} finally {
    await conn.end();
}

async function openAccount(accountId) {
    await conn.query('insert into accounts (account_id) values ($1)', [accountId]); 
}
