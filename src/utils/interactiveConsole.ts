/* eslint-disable sonarjs/no-identical-functions */
import readline from 'node:readline';

import { appConfig } from '../config/config';
import { interactiveConsoleCommands } from '../config/iConsole';
import { log } from './consoleLogging';

let firstLaunch = true;

export async function interactiveConsole() {
    if (!appConfig.interactiveConsole) return;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const queryString = firstLaunch
        ? 'Enter a command, use help for list of commands\n> '
        : '> ';

    rl.question(queryString, async (userInput) => {
        // How the user input is handled.

        if (userInput.toLowerCase() === 'exit') {
            log('Exited Interactive Console');
            firstLaunch = true;

            return rl.close();
        }

        if (userInput.toLowerCase() === 'help') {
            let commandsList = '';

            for (const command in interactiveConsoleCommands) {
                commandsList = `${command} - ${interactiveConsoleCommands[command].description}`;
            }

            log(commandsList);
            firstLaunch = false;

            rl.close();

            return await interactiveConsole();
        }

        const splitInput = userInput.toLowerCase().split(' ');
        const cmd = splitInput.shift();

        if (!cmd) {
            log(
                'An error occurred with the interactive console. No command was found please try again.'
            );

            firstLaunch = false;
            rl.close();

            return await interactiveConsole();
        }

        const findCommand = interactiveConsoleCommands[cmd];

        if (!findCommand) {
            log(`${cmd} is not a command.\nUse help to check list of commands`);
            firstLaunch = false;
            rl.close();

            return await interactiveConsole();
        }

        await findCommand.callback(...splitInput);
        firstLaunch = false;
        rl.close();

        return await interactiveConsole();
    });
}
