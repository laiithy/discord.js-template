import { appConfig } from '../config/config';
import { discordClient } from '../config/discordClient';
import { CommandHandler } from '../modules/handler/commandHandler';
import { cr_coolDown } from '../modules/handler/rules/coolDown';
import { cr_requiredRoles } from '../modules/handler/rules/requiredRoles';
import { dc_terminal } from './commands/terminal';
import { de_readyEvent } from './events/ready';

export const commandHandler = new CommandHandler({
    client: discordClient,
    commandRules: [cr_coolDown, cr_requiredRoles],
    commands: [dc_terminal],
    events: [de_readyEvent],
    guilds: appConfig.discordGuilds,
});
