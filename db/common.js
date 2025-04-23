export async function recreate(db) {
    await db.query('drop table if exists accounts');
    await db.query('drop table if exists vault');
    await db.query(`
        create table accounts (
            account_id integer primary key check (0 <= account_id and account_id < 1000000),
            balance    numeric(20, 2) not null default 0 check (balance >= 0)
        );
        create table vault (
            balance    numeric(20, 2) not null default 0 check (balance >= 0)
        );
        insert into vault (balance) values (0.0);
    `);    
}

export async function checkAccountExists(db, account) {
    const dbResult = await db.query('select exists (select 1 from accounts where account_id = $1)', [account]);
    if (!dbResult.rows[0].exists) {
        throw new Error(`Account ${account} does not exist`)
    }
}

export async function checkZeroBalance(db, account) {
    const dbResult = await db.query('select balance from accounts where account_id = $1', [account]);
    if (dbResult.rows[0].balance > 0) {
        throw new Error(`Account ${account} has non-zero balance`)
    }
}

export function parseAccountId(s) {
    try {
        const accountId = parseInt(s);
        if (0 <= accountId) {
            return accountId;
        }
    } catch (e) {
        // fallthrough
    }
    throw new Error(`Invalid account ID: ${s}`);
}

export function parseAmount(s) {
    try {
        const amount = parseFloat(s);
        if (0 <= amount) {
            return amount;
        }
    } catch (e) {
        // fallthrough
    }
    throw new Error(`Invalid amount: ${s}`);
}
