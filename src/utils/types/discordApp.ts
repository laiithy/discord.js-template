/* eslint-disable unused-imports/no-unused-vars */
import {
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
} from 'discord.js';

export type DiscordCommand = ChatInputApplicationCommandData & {
    guildSpecific?: boolean;
    update?: boolean;
    disable?: boolean;
    devOnly?: boolean;
    devBypass?: boolean;
    cooldown?: {
        time: number;
        global: boolean;
        perUser: boolean;
        adminBypass: boolean;
    };
    requiredRoles?: {
        roles: string[];
        requireAll: boolean;
        adminBypass: boolean;
    };
    callback: (
        interaction: ChatInputCommandInteraction,
        client?: Client
    ) => Promise<unknown>;
};

export type DiscordEvent = {
    name: keyof ClientEvents;
    callback: (...arguments_: any[]) => Promise<void>;
};

export type CommandRule = (
    command: DiscordCommand,
    interaction: ChatInputCommandInteraction,
    client: Client
) => Promise<{
    valid: boolean;
    errorMessage: string;
}>;
