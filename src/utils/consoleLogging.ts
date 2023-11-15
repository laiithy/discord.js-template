import { readFileSync, writeFileSync } from 'node:fs';

import { appConfig } from '../config/config';
import { colors } from './colors';

const originalConsoleLog = console.log;

export const log = (text: string) => {
    originalConsoleLog.call(console, text);
};

export const buildLogs = () => {
    console.log = function () {
        const currentDate = new Date().toLocaleString();

        const formatDate = `${colors.fgCyan}[${currentDate}] ${colors.fgGreen}[LOG]${colors.reset} `;

        if (appConfig.saveLogs) {
            const readFile = readFileSync(process.cwd() + '/src/data/logs.txt');
            const readFileString = readFile.toString();

            writeFileSync(
                process.cwd() + '/src/data/logs.txt',
                `${readFileString}[${currentDate}] [LOG] ${[...arguments].join(
                    ' '
                )}\n`
            );
        }

        originalConsoleLog.call(console, formatDate, ...arguments);
    };
};
