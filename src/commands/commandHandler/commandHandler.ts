import { config } from "../../index";
import { Client, Collection, Message } from "discord.js";
import getFileFromRepository from "../../util/getFileFromRepository";

import ArgDirCommand from "../commandTypes/ArgDir";
import BasicCommand from "../commandTypes/Basic";
import HelpCommand from "../custom/helpCommand";
import updateDataCommand from "../custom/updateDataCommand";

type Command = ArgDirCommand | BasicCommand;

class CommandHandler {

    public commands: Collection<string, Command> = new Collection();
    
    constructor(client: Client) {
        client.on("messageCreate", (message: Message) => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (!message.content.startsWith(config.prefix)) return;
            if (config.channelExclusions.commands.includes(message.channel.id)) return;
            
            const args = message.content.substring(config.prefix.length).split(/ +/g);
            const cmd = args.shift()!.toLowerCase();

            if (!cmd) return;
            if (!this.commands.has(cmd)) return;

            const command = this.commands.get(cmd)!;
            command.execute(message, args);
        });
    }
    
    public loadCommands() {
        const commands = JSON.parse(getFileFromRepository('/commands.json'))?.commands;
        for (const command of commands) { 
            if (command.type === 'argdir') {
                this.load(new ArgDirCommand(command.aliases[0], command.description));
            } else if (command.type === 'basic') {
                this.load(new BasicCommand(command.aliases[0], command.description));
            }
        }

        // Hardcoded commands
        this.loadCustom(new HelpCommand());
        this.loadCustom(new updateDataCommand());
    }

    public load(command: Command) {
        this.commands.set(command.name, command);
    }

    public loadCustom(command: any) {
        this.commands.set(command.name, command);
    }
}

export default CommandHandler;