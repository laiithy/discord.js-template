/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable prettier/prettier */
import { Client } from 'discord.js';

import {
    CommandRule,
    DiscordCommand,
    DiscordEvent,
} from '../../utils/types/discordApp';
import { CommandListener } from './interactionCreate';

export class CommandHandler {
    options: {
        client: Client;
        guilds: string[];
        commands: DiscordCommand[];
        events: DiscordEvent[];
        commandRules: CommandRule[];
    };
    constructor(options: {
        client: Client;
        guilds: string[];
        commands: DiscordCommand[];
        events: DiscordEvent[];
        commandRules: CommandRule[];
    }) {
        // eslint-disable-next-line prefer-destructuring
        this.options = options;
    }

    //Finds the guilds available to the discord application
    sortGuilds(): string[] {
        const validGuilds: string[] = [];

        for (const guild of this.options.guilds) {
            if (this.options.client.guilds.cache.get(guild))
                validGuilds.push(guild);
        }

        return validGuilds;
    }


    private async create(command: DiscordCommand, guild?: string) {
        const guildName =
            command.guildSpecific && guild
                ? `in ${this.options.client.guilds.cache.get(guild)?.name}`
                : '';

        const fetchCommands =
            command.guildSpecific && guild
                ? await this.options.client.application?.commands.fetch({
                    guildId: guild,
                })
                : await this.options.client.application?.commands.fetch();

        console.log(
            `Checking command ${command.name}'s availability ${guildName}`
        );

        const findCommand = fetchCommands?.find(
            (cmd) => command.name === cmd.name
        );


        findCommand
            ? console.log(
                `Skipping command ${command.name} creation because it already exists ${guildName}`
            )
            : (command.guildSpecific && guild
                ? (await this.options.client.application?.commands.create(
                    command,
                    guild
                ) && console.log(`The command ${command.name} was created ${guildName}`))
                : (await this.options.client.application?.commands.create(command)) && console.log(`The command ${command.name} was created ${guildName}`));
    }


    private async delete() {

        console.log('Deleting commands not found on file');

        const guilds = this.sortGuilds();
        const fetchCommands =
            await this.options.client.application?.commands.fetch();

        //Deleting commands not available on file
        fetchCommands?.forEach((cmd) => {

            const findCommand = this.options.commands.find(command => command.name === cmd.name);

            if (!findCommand || findCommand && findCommand.disable) {
                this.options.client.application?.commands.delete(cmd.id);
                console.log(`The command ${cmd.name} was deleted`);
            }

        });

        for (const guild of guilds) {
            const fetchGuildCommands = await this.options.client.application?.commands.fetch({ guildId: guild });

            fetchGuildCommands?.forEach((cmd) => {

                const findCommand = this.options.commands.find(command => command.name === cmd.name && command.guildSpecific);

                if (!findCommand || findCommand && findCommand.disable) {
                    this.options.client.application?.commands.delete(cmd.id, guild);
                    console.log(`The command ${cmd.name} was deleted in ${this.options.client.guilds.cache.get(guild)?.name}`);
                }

            });

        }

    }


    // eslint-disable-next-line sonarjs/cognitive-complexity
    private async update() {

        const guilds = this.sortGuilds();

        console.log('Updating application commands');

        for (const command of this.options.commands) {
            if (!command.update) return;

            //Updating guild application commands
            if (command.guildSpecific) {
                for (const guild of guilds) {
                    const fetchCommands = await this.options.client.application?.commands.fetch({ guildId: guild });
                    const findCommand = fetchCommands?.find(cmd => cmd.name === command.name);

                    if (findCommand) {
                        findCommand.edit(command);
                        console.log(`Updated the command ${command.name} in ${this.options.client.guilds.cache.get(guild)?.name}`);
                    }

                    if (!findCommand && !command.disable) (await this.options.client.application?.commands.create(
                        command,
                        guild
                    ) && console.log(`The command ${command.name} was created in ${this.options.client.guilds.cache.get(guild)}`));
                }


                //Updating non guild specific command
            } else if (!command.guildSpecific) {
                const fetchCommands = await this.options.client.application?.commands.fetch();
                const findCommand = fetchCommands?.find(cmd => cmd.name === command.name);

                if (findCommand) {
                    findCommand.edit(command);
                    console.log(`Updated the command ${command.name}`);
                }

                if (!findCommand && !command.disable) (await this.options.client.application?.commands.create(
                    command
                ) && console.log(`The command ${command.name} was created`));
            }
        }
    }


    async run() {
        const guilds = this.sortGuilds();

        console.log('Creating application commands');

        for (const command of this.options.commands) {
            if (command.disable) continue;

            if (command.guildSpecific) {
                for (const guild of guilds) await this.create(command, guild);
            }

            if (!command.guildSpecific) await this.create(command);
        }

        await this.delete();
        await this.update();

        for (const event of this.options.events) {
            console.log(`Enabling one "${event.name}" event listener`);
            this.options.client.on(event.name, event.callback);
        }

        const { commands, commandRules, client } = this.options;

        console.log('Launching application command listener');
        CommandListener(commands, client, commandRules);
    }
}
