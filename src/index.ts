/* eslint-disable unicorn/no-empty-file */
import { config } from 'dotenv';

import { commandHandler } from './app/handler';
import { appConfig } from './config/config';
import { applicationLogin } from './utils/clientLogin';
import { buildLogs } from './utils/consoleLogging';
import { interactiveConsole } from './utils/interactiveConsole';

buildLogs();
config();
(async () => {
    console.log('Accessing discord application');
    await applicationLogin();

    console.log('Building command system');
    await commandHandler.run();

    if (appConfig.interactiveConsoleStart) {
        console.log('Launching interactive console');
        await interactiveConsole();
    }
})();
