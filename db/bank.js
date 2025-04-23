import connect from './connect.js';
import print from './print.js';
import open from './open.js';
import deposit from './deposit.js';
import withdraw from './withdraw.js';
import transfer from './transfer.js';
import close from './close.js';
import reset from './reset.js';

const promptedConnection = await connect(true);
const connection = await connect();
let usePrompts = false;
function currentConnection() {
    return usePrompts ? promptedConnection : connection;
}

while (true) {
    const s = (await promptForCommandString()).trim();
    if (s.length === 0) {
        console.log('Please enter a command: print | open | deposit | withdraw | transfer | close | reset | prompt | quit')
        continue;
    }
    const split = s.split(/\s+/);
    const command = split[0];
    const args = split.slice(1);
    await executeCommand(command, args);
}

function promptForCommandString() {
    process.stdout.write(usePrompts ? 'bank?> ' : 'bank> ');
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    return new Promise((r) => process.stdin.once('data', (data) => {
        process.stdin.pause();
        r(data);
    }));
}

async function executeCommand(command, args) {
    try {
        await dispatchCommand(command, args);
    } catch (e) {
        console.log(`Command ${command} failed:`, e.message);
    }
}

async function dispatchCommand(command, args) {
    switch (command) {
        case 'quit':
            await quit([connection, promptedConnection], args);
            break;
        case 'reset':
            await reset(connection, args);
            break;
        case 'open':
            await open(currentConnection(), args);
            break;
        case 'close':
            await close(currentConnection(), args);
            break;
        case 'deposit':
            await deposit(currentConnection(), args);
            break;
        case 'withdraw':
            await withdraw(currentConnection(), args);
            break;
        case 'print':
            await print(currentConnection(), args);
            break;
        case 'transfer':
            await transfer(currentConnection(), args);
            break;
        case 'prompt':
            usePrompts = !usePrompts;
            break;
        default:
            console.log(`Unknown command: '${command}'`)
    }
}

async function quit(connections, args) {
    for (const connection of connections) {
        await connection.end();
    }
    process.exit(0);
}
