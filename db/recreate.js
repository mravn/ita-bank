import connect from './connect.js';

const conn = await connect(false);
try {
    await conn.query('drop table if exists accounts');
    await conn.query('drop table if exists vault');
    await conn.query(`
        create table accounts (
            account_id integer primary key check (0 <= account_id and account_id < 1000000),
            balance    numeric(20, 2) not null default 0 check (balance >= 0)
        );
        create table vault (
            balance    numeric(20, 2) not null default 0 check (balance >= 0)
        );
        insert into vault (balance) values (0.0);
    `);
    console.log('Success.');
} catch (e) {
    console.error('Recreation failed:', e.message);
} finally {
    await conn.end();
}
