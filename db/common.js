export async function checkAccountExists(conn, accountId) {
    const dbResult = await conn.query('select exists (select 1 from accounts where account_id = $1)', [accountId]);
    if (!dbResult.rows[0].exists) {
        throw new Error(`Account ${accountId} does not exist`)
    }
}

export async function checkZeroBalance(conn, accountId) {
    const dbResult = await conn.query('select balance from accounts where account_id = $1', [accountId]);
    if (dbResult.rows[0].balance > 0) {
        throw new Error(`Account ${accountId} has non-zero balance`)
    }
}

export function checkNonNegativeAmount(amount) {
    if (amount < 0) {
        throw new Error('Amounts cannot be negative');
    }
}
