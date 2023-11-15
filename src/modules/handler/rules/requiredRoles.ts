import { PermissionFlagsBits } from 'discord.js';

import { CommandRule } from '../../../utils/types/discordApp';

export const cr_requiredRoles: CommandRule = async (
    command,
    interaction,
    client
) => {
    const returnData = {
        errorMessage: 'You are missing roles required to run this command',
        valid: true,
    };

    if (
        !command.requiredRoles ||
        !interaction.inCachedGuild() ||
        (command.requiredRoles.adminBypass &&
            interaction.member.permissions.has(
                PermissionFlagsBits.Administrator
            ))
    )
        return returnData;

    const rolesFound = command.requiredRoles.requireAll
        ? interaction.member.roles.cache.hasAll(...command.requiredRoles.roles)
        : interaction.member.roles.cache.hasAny(...command.requiredRoles.roles);

    if (!rolesFound) returnData.valid = false;

    return returnData;
};
