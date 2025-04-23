import connect from './connect.js';

const conn = await connect();
try {
    await printAccounts(conn);
} catch (e) {
    console.error('Printing failed.', e.message);
} finally {
    await conn.end();
}

async function printAccounts(conn) {
    const lines = [''];
    const dbResult = await conn.query('select account_id, balance from accounts order by account_id asc');
    lines.push(`Number of accounts: ${dbResult.rows.length.toString().padStart(9)}`);
    lines.push('-----------------------------')
    let totalBalance = 0;
    for (const row of dbResult.rows) {
        const balance = parseFloat(row.balance);
        lines.push(`${row.account_id.toString().padStart(6, '0')}: ${balance.toFixed(2).padStart(21)}`);
        totalBalance += balance;
    }
    lines.push('-----------------------------')
    const vaultBalance = parseFloat((await conn.query('select balance from vault')).rows[0].balance);
    const check = (totalBalance === vaultBalance) ? '✓' : '✗';
    lines.push(`Total balance: ${totalBalance.toFixed(2).padStart(14)} ${check}`);
    lines.push(`Vault balance: ${vaultBalance.toFixed(2).padStart(14)} ${check}`);
    lines.push('');
    for (const line of lines) {
        console.log(line);
    }
}
