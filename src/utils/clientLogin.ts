import { discordClient } from '../config/discordClient';
export async function applicationLogin() {
    await discordClient
        .login(process.env.BOT_TOKEN)
        .catch((error) => {
            if (error) {
                throw new Error(
                    // eslint-disable-next-line quotes
                    `An error was encountered while logging into the discord client:
                 1. Double check that the token provided is valid
                 2. Check if bot intents are enabled
                 3. Make sure you have a stable internet connection
                 4. Make sure discord isn't facing any runtime errors
                 
                 Error ${error}`
                );
            }
        })
        .then(() =>
            console.log('Successfully Logged Into The Discord Application')
        );
}
