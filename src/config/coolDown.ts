import { writeFileSync } from 'node:fs';

import data from '../data/coolDown.json';

export const coolDownData: {
    [index: string]: number;
} = data;

export function updateCoolDowns() {
    for (const coolDown in coolDownData) {
        const coolDownNumber = coolDownData[coolDown];

        if (coolDownNumber - Date.now() <= 0) delete coolDownData[coolDown];
    }

    const jsonStringData = JSON.stringify(coolDownData);

    writeFileSync(process.cwd() + '/src/data/coolDown.json', jsonStringData);
}
