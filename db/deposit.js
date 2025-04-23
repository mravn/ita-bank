import connect from './connect.js';
import { checkAccountExists, checkNonNegativeAmount } from './common.js';

if (process.argv.length !== 5 || process.argv[3] !== 'into') {
    console.error('Usage: npm run deposit <amount> into <account>')
    process.exit(1);
}

const conn = await connect();
try {
    const amount = parseFloat(process.argv[2]);
    const accountId = parseInt(process.argv[4]);
    await deposit(conn, amount, accountId);
    console.log('Success.');
} catch (e) {
    console.error('Deposit failed:', e.message);
} finally {
    await conn.end();
}

async function deposit(conn, amount, accountId) {
    checkNonNegativeAmount(amount);
    await checkAccountExists(conn, accountId);
    await conn.query('update accounts set balance = balance + $1 where account_id = $2', [amount, accountId]);
    await conn.query('update vault set balance = balance + $1', [amount]);
}
