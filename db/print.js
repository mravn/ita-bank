export default async function print(db, args) {
    if (args.length !== 0) {
        console.log('Usage: p[rint]');
        return;
    }
    await doPrint(db);
}

async function doPrint(db) {
    const lines = [''];
    const dbResult = await db.query('select account_id, balance from accounts order by account_id asc');
    lines.push(`Number of accounts: ${dbResult.rows.length.toString().padStart(8)}`);
    lines.push('----------------------------')
    let total = 0;
    for (const row of dbResult.rows) {
        const balance = parseFloat(row.balance);
        lines.push(`${row.account_id.toString().padStart(6, '0')}: ${balance.toFixed(2).padStart(20)}`);
        total += balance;
    }
    lines.push('----------------------------')
    const vault = parseFloat((await db.query('select balance from vault')).rows[0].balance);
    const check = (total === vault) ? '✓' : '✗';
    lines.push(`Total : ${total.toFixed(2).padStart(20)} ${check}`);
    lines.push(`Vault : ${vault.toFixed(2).padStart(20)} ${check}`);
    lines.push('');
    for (const line of lines) {
        console.log(line);
    }
}
