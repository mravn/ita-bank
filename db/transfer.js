import connect from './connect.js';
import { checkAccountExists, checkNonNegativeAmount } from './common.js';

if (process.argv.length !== 7 || process.argv[3] !== 'from' || process.argv[5] !== 'to') {
    console.error('Usage: npm run transfer <amount> from <sender> to <receiver>')
    process.exit(1);
}

const conn = await connect();
try {
    const amount = parseFloat(process.argv[2]);
    const sender = parseInt(process.argv[4]);
    const receiver = parseInt(process.argv[6]);
    await transfer(conn, amount, sender, receiver);
    console.log('Success.');
} catch (e) {
    console.log('Transfer failed:', e.message);
} finally {
    await conn.end();
}

async function transfer(conn, amount, sender, receiver) {
    checkNonNegativeAmount(amount);
    await checkAccountExists(conn, sender);
    await checkAccountExists(conn, receiver);
    await conn.query('update accounts set balance = balance + $1 where account_id = $2', [amount, receiver]);
    await conn.query('update accounts set balance = balance - $1 where account_id = $2', [amount, sender]);
}
