import { recreate } from "./common.js";

export default async function reset(db, args) {
    if (args.length !== 0) {
        console.log('Usage: init');
        return;
    }
    await doInit(db);
}

async function doInit(db) {
    await recreate(db);
}
