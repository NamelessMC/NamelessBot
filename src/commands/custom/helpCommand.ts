import { Message } from "discord.js";
import EmbedUtils from "../../constants/EmbedUtil";
import { HelpConfig } from "../../constants/types";
import getFileFromRepository from "../../util/getFileFromRepository";

class HelpCommand {

    public name: string = "help";
    public description: string = "Displays all the available commands for the bot.";

    public execute(msg: Message, _args: string[]) {

        const contents = JSON.parse(getFileFromRepository("/commands.json")) as HelpConfig;
        const commands = contents.commands.filter(command => command.hidden !== true);
        
        EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.OK, "Help", "", commands.map(c => `**${c.aliases[0]}**: ${c.description}`).join('\n'))
    }
}

export default HelpCommand;