import shelljs from 'shelljs';

function parseArgs(): { nextCommand: string } {
    const otherArgs = process.argv.findIndex((arg: string) => arg === '--');
    if (otherArgs === -1) {
        throw new Error(
            'No command to run was specified, make sure to add -- before next command'
        );
    }
    const prepArgs = process.argv.slice(2, otherArgs);
    if (prepArgs.includes('--help') || prepArgs.includes('-h')) {
        console.log('Usage: ts-node prep-env-vars.ts [-v] -- <command to run>');
    }
    if (prepArgs.includes('--verbose') || prepArgs.includes('-v')) {
        shelljs.config.verbose = true;
    }
    const args = process.argv.slice(otherArgs + 1);
    return {nextCommand: args.join(' ')};
}

function prepareEnvWithVars() {
    // right now this is only used in dev envs, but if we use it for other envs we would
    // need to set a separate vault for each env
    const nodeEnv =
    (process.env.NODE_ENV ?? '').trim() === '' ?
        'development' :
        process.env.NODE_ENV;
    shelljs.env.NODE_ENV = nodeEnv;
    const {nextCommand} = parseArgs();
    shelljs.exec(nextCommand);
}

prepareEnvWithVars();
