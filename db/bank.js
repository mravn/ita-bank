import { connect, connectWithSuspension } from './connect.js';
import print from './print.js';
import open from './open.js';
import deposit from './deposit.js';
import withdraw from './withdraw.js';
import transfer from './transfer.js';
import close from './close.js';
import reset from './reset.js';

const suspendedConnection = await connectWithSuspension();
const connection = await connect();
let suspendMode = false;
function currentConnection() {
    return suspendMode ? suspendedConnection : connection;
}

while (true) {
    const s = (await promptForCommandString()).trim();
    if (s.length === 0) {
        console.log('Please enter a command: print | open | deposit | withdraw | transfer | close | reset | suspend | quit')
        continue;
    }
    const split = s.split(/\s+/);
    const command = split[0];
    const args = split.slice(1);
    await executeCommand(command, args);
}

function promptForCommandString() {
    process.stdout.write(suspendMode ? 'bank$ ' : 'bank> ');
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
        case 'p':
        case 'print':
            await print(currentConnection(), args);
            break;
        case 'o':
        case 'open':
            await open(currentConnection(), args);
            break;
        case 'd':
        case 'deposit':
            await deposit(currentConnection(), args);
            break;
        case 'w':
        case 'withdraw':
            await withdraw(currentConnection(), args);
            break;
        case 't':
        case 'transfer':
            await transfer(currentConnection(), args);
            break;
        case 'c':
        case 'close':
            await close(currentConnection(), args);
            break;
        case 'r':
        case 'reset':
            await reset(connection, args);
            break;
        case 's':
        case 'suspend':
            suspend(args);
            break;
        case 'q':
        case 'quit':
            await quit();
            break;
        default:
            console.log(`Unknown command: '${command}'`)
    }
}

async function quit() {
    await connection.end();
    await suspendedConnection.end();
    process.exit(0);
}

function suspend(args) {
   if (args.length !== 1 || (args[0] !== 'on' && args[0] !== 'off')) {
       console.log("Usage: suspend [on|off]");
       return;
   }
   suspendMode = (args[0] === 'on');
}
