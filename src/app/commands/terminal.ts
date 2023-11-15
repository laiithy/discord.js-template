import { Colors, EmbedBuilder } from 'discord.js';

import { interactiveConsole } from '../../utils/interactiveConsole';
import { DiscordCommand } from '../../utils/types/discordApp';

export const dc_terminal: DiscordCommand = {
    name: 'terminal',
    description: 'Launches an interactive console in the process terminal',
    devOnly: true,
    callback: async (interaction) => {
        await interaction.deferReply();

        const userDisplayEmbed = new EmbedBuilder()
            .setColor(Colors.Blurple)
            .setDescription('Enabling interactive console...');

        await interaction
            .followUp({ embeds: [userDisplayEmbed] })
            .then(async (message) => {
                console.log(
                    `Enabling interactive console using discord command run by user ${interaction.user.id}(${interaction.user.username})`
                );
                await interactiveConsole();
                const editEmbed = new EmbedBuilder()
                    .setColor(Colors.Blurple)
                    .setDescription('Interactive console has been enabled');

                await message.delete();
                await interaction.followUp({ embeds: [editEmbed] });
            });
    },
};
