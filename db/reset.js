import { recreate } from "./common.js";

export default async function reset(db, args) {
    if (args.length !== 0) {
        console.log('Usage: r[eset]');
        return;
    }
    await recreate(db);
}
