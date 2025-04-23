import { recreate } from "./common.js";
import connect from "./connect.js";

const db = await connect();
try {
    process.stdout.write('(Re-)creating database... ')
    await recreate(db);
    console.log('Done.')
} finally {
    db.end();
}
