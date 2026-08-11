import {
    createCommandsRegistry,
    runCommand,
} from "./command.js";

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error("Error: not enough arguments");
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    const registry = createCommandsRegistry();

    try {
        await runCommand(registry, cmdName, ...cmdArgs);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    process.exit(0);
}

main();