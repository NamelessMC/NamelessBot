import { Message } from "discord.js";
import EmbedUtils from "../../constants/EmbedUtil";
import { Command } from "../../constants/types";
import getFileFromRepository from "../../util/getFileFromRepository";

class BasicCommand {

    public name: string;
    public description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    public execute(msg: Message, args: string[]) {

        const commandName = this.name;

        // Get the command from the files
        try {
            const command = JSON.parse(getFileFromRepository(`/commands/${commandName}.json`));
            if (!command) return;

            return this.handleResponse(msg, command);
        } catch (error) {
            // Ignore the error, the command doesn't exist
        }
    }

    public async handleResponse(msg: Message, response: Command) {
        EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.OK, response.title, response.footer, response.body.join('\n'));
    }
}

export default BasicCommand;