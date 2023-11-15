/* eslint-disable unicorn/prevent-abbreviations */
import { log } from '../utils/consoleLogging';
/* eslint-disable unicorn/prevent-abbreviations */
export const interactiveConsoleCommands: {
    [index: string]: {
        description: string;
        callback: (...args: string[]) => Promise<unknown>;
    };
} = {
    hello: {
        description: 'says hello back to you',
        callback: async () => {
            log('Hello Sir');
        },
    },
};
