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
        console.log('Please enter a command.');
        printUsage();
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
        case 'h':
        case 'help':
            await help(args);
            break;
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
            await suspend(args);
            break;
        case 'q':
        case 'quit':
            await quit(args);
            break;
        default:
            console.log(`Unknown command: '${command}'`);
            printUsage();
    }
}

async function help(args) {
    if (args.length !== 0) {
        console.log('Usage: h[elp]');
        return;
    }
    printUsage();
}

function printUsage() {
    console.log();
    console.log('Usage:');
    console.log('  h[elp]     -- get help');
    console.log('  p[rint]    -- print accounts');
    console.log('  o[pen]     -- open account');
    console.log('  d[eposit]  -- deposit funds');
    console.log('  w[ithdraw] -- withdraw funds');
    console.log('  t[ransfer] -- transfer funds between accounts');
    console.log('  c[lose]    -- close account');
    console.log('  r[eset]    -- reset database');
    console.log('  s[uspend]  -- toggle suspend mode');
    console.log('  q[uit]     -- quit application');
    console.log();
}

async function quit(args) {
    if (args.length !== 0) {
        console.log('Usage: q[uit]');
        return;
    }
    await connection.end();
    await suspendedConnection.end();
    process.exit(0);
}

async function suspend(args) {
    if (args.length === 0) {
        suspendMode = !suspendMode;
        return;
    }
    if (args.length === 1) {
        const isOn = (args[0] === 'on');
        const isOff = (args[0] === 'off');
        if (isOn || isOff) {
            suspendMode = isOn;
            return;
        }
    }
    console.log("Usage: s[uspend] [on|off]");
}
