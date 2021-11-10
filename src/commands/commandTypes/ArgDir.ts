import { Message } from "discord.js";
import EmbedUtils from "../../constants/EmbedUtil";
import { Command, CommandParemeters } from "../../constants/types";
import getFileFromRepository from "../../util/getFileFromRepository";

class ArgDirCommand {

    public name: string;
    public description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    public execute(msg: Message, args: string[]) {
        
        const commandName = this.name;
        const parameter = args[0]?.toLowerCase();

        // If no arguments are given, list all available parameters
        if (!parameter) {
            
            const commands = JSON.parse(getFileFromRepository(`./commands/${commandName}.json`));
            if (!commands) return;

            return this.handleResponse(msg, commands);
        }

        try {
            const command = JSON.parse(getFileFromRepository(`./commands/${commandName}/${parameter}.json`));
            if (!command) return;
    
            return this.handleResponse(msg, command);
        } catch (error) {
            EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.ERROR, "Error", "", "The parameter you requested doesn't exist.");
        }
    }

    public async handleResponse(msg: Message, response: Command | CommandParemeters) {
        if (isCommand(response)) {
            EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.OK, response.title, response.footer, response.body.join('\n'));
        } else {
            EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.OK, response.title, response.footer, "Available parameters: " + response.parameters.map(c => `\`${c}\``).join(', '))
        }
    }
}

function isCommand(input: Command | CommandParemeters): input is Command { //magic happens here
    return (<CommandParemeters>input).parameters == undefined;
}

export default ArgDirCommand;