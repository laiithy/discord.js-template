import { DiscordEvent } from '../../utils/types/discordApp';

export const de_readyEvent: DiscordEvent = {
    name: 'ready',
    callback: async () => {
        console.log('The discord application is ready');
    },
};
