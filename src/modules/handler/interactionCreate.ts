import { Client, Colors, EmbedBuilder } from 'discord.js';

import { appConfig } from '../../config/config';
import { CommandRule, DiscordCommand } from '../../utils/types/discordApp';

export const CommandListener = (
    commands: DiscordCommand[],
    client: Client,
    rules: CommandRule[]
) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.command) return;

        const commandName = interaction.command.name;

        const command = commands.find((cmd) => cmd.name === commandName);

        if (!command) {
            const noCommandEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setAuthor({
                    name: 'Sorry! There has been a system side error.\nThe command you used is not available.',
                });

            await interaction.reply({
                embeds: [noCommandEmbed],
                ephemeral: true,
            });
            await interaction.command.delete();

            return;
        }

        if (
            command.devBypass &&
            interaction.user.id === appConfig.developerID
        ) {
            await command.callback(interaction, client);

            return;
        }

        if (command.devOnly && interaction.user.id !== appConfig.developerID) {
            const developerOnly = new EmbedBuilder()
                .setColor(Colors.Red)
                .setAuthor({
                    name: 'Only developers are allowed to use this command.',
                });

            await interaction.reply({
                embeds: [developerOnly],
                ephemeral: true,
            });

            return;
        }

        let validate = true;
        let errorReasons = '';

        for (const rule of rules) {
            const runRule = await rule(command, interaction, client);

            if (!runRule.valid) {
                validate = false;
                errorReasons += runRule.errorMessage;
            }
        }

        if (!validate) {
            const unValid = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(errorReasons);

            await interaction.reply({ embeds: [unValid], ephemeral: true });

            return;
        }

        await command.callback(interaction, client);
    });
};
