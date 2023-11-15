import { Client, IntentsBitField } from 'discord.js';

const Intents = new IntentsBitField().add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessageReactions
);

export const discordClient = new Client({
    intents: Intents,
});
