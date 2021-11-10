import Collection from "@discordjs/collection";
import ArgDirCommand from "../commandTypes/ArgDir";
import BasicCommand from "../commandTypes/Basic";
import { client, config } from '../../index';

import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { Client } from "discord.js";

type Command = ArgDirCommand | BasicCommand;

class CommandHandler {

    public commands: Collection<string, Command> = new Collection();
    public commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];

    constructor(client: Client) {
        client.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) return;

            const { commandName } = interaction;
            const cmd = this.commands.get(commandName);
            if (cmd) {
                cmd.execute(interaction);
            }
        })
    }

    public load(command: Command) {
        this.commands.set(command.command.name, command);
        this.commandData.push(command.command.toJSON())
    }

    public loadCustom(command: any) {
        this.commands.set(command.command.name, command);
        this.commandData.push(command.command.toJSON());
    }

    public async deploy() {
        const rest = new REST({ version: '9' }).setToken(config.token);
        try { 
            console.log('Deploying commands...');

            await rest.put(Routes.applicationGuildCommands(client.user!.id, config.guildID),
            { body: this.commandData })
        } catch (error) {
            console.error(error);
        }
    }
}

export default CommandHandler;