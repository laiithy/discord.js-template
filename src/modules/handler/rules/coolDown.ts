import { PermissionFlagsBits } from 'discord.js';
import ms from 'pretty-print-ms';

import { coolDownData, updateCoolDowns } from '../../../config/coolDown';
import { CommandRule } from '../../../utils/types/discordApp';

export const cr_coolDown: CommandRule = async (
    command,
    interaction,
    client
) => {
    const returnData = {
        valid: true,
        errorMessage:
            'Woah SLOWDOWN! The command is on cool down you can use it in {TIME}',
    };

    updateCoolDowns();

    if (
        !command.cooldown ||
        !interaction.inCachedGuild() ||
        (command.cooldown.adminBypass &&
            interaction.member?.permissions.has(
                PermissionFlagsBits.Administrator
            ))
    )
        return returnData;

    const stringOptions = {
        global: command.cooldown.global ? '' : `${interaction.guild?.id}_`,
        perUser: command.cooldown.perUser ? `${interaction.user.id}_` : '',
        commandId: interaction.command?.id,
    };

    const validationString =
        stringOptions.global + stringOptions.perUser + stringOptions.commandId;

    const findData = coolDownData[validationString];

    if (!findData || findData - Date.now() <= 0) {
        coolDownData[validationString] = Date.now() + command.cooldown.time;

        return returnData;
    }

    if (findData - Date.now() > 0) {
        returnData.valid = true;
        returnData.errorMessage = returnData.errorMessage.replace(
            '{TIME}',
            ms(findData - Date.now())
        );
    }

    return returnData;
};
