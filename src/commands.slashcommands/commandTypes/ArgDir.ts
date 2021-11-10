import { CommandInteraction } from "discord.js";
import GetLatestCommitHash from "../../util/GetLatestCommitHash";
import Cache from '../../cache/Cache';
import { Command, CommandParemeters } from "../../constants/types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { config } from "../../index";
import fetch from "node-fetch";
import EmbedUtils from "../../constants/EmbedUtil";

const CommandCache = new Cache<Command>();

class ArgDirCommand {

    constructor(name: string, description: string) {
        this.command.setName(name.toLowerCase());
        this.command.setDescription(description);
        this.command.addStringOption((option) => option.setName("parameter").setDescription("The parameter you want to pass into this command"));
    }

    public command = new SlashCommandBuilder();

    public async execute(ctx: CommandInteraction) {

        const commandName = this.command.name;
        const input = ctx.options.getString("parameter")?.toLowerCase();

        // If no arguments are given, list all available parameters

        if (!input) {
            // Check if the command already exists in cache
            const response = CommandCache.get(commandName);
            if (response) {
                this.handleResponse(ctx, response);
            }
    
            // Get latest commit hash
            const latestCommitHash = await GetLatestCommitHash();
    
            // Check if the command exists
            const githubURL = `https://raw.githubusercontent.com/${config.organizationName}/${config.repositoryName}/${latestCommitHash}/commands/${encodeURIComponent(commandName)}.json`
            const command = await fetch(githubURL).then((response) => response.json()) as Command;
            if (!command) return;
    
            // Put it in cache and handle it out
            CommandCache.put(commandName, command);
            return this.handleResponse(ctx, command);
        }

        // Check if the command already exists in cache
        const response = CommandCache.get(input);
        if (response) {
            this.handleResponse(ctx, response);
        }

        // Get latest commit hash
        const latestCommitHash = await GetLatestCommitHash();

        // Check if the command exists
        const githubURL = `https://raw.githubusercontent.com/${config.organizationName}/${config.repositoryName}/${latestCommitHash}/commands/${encodeURIComponent(commandName)}/${encodeURIComponent(input)}.json`
        try {
            const command = await fetch(githubURL).then((response) => response.json()) as Command;
            if (!command) return;

            // Put it in cache and handle it out
            CommandCache.put(input, command);
            return this.handleResponse(ctx, command);
        } catch (error) {
            EmbedUtils.sendSlashResponse(ctx, EmbedUtils.embedColor.ERROR, "Error", "", "The parameter you requested doesn't exist.");
        }

    }

    public async handleResponse(ctx: CommandInteraction, response: Command | CommandParemeters) {
        if (isCommand(response)) {
            EmbedUtils.sendSlashResponse(ctx, EmbedUtils.embedColor.OK, response.title, response.footer, response.body.join('\n'));
        } else {
            EmbedUtils.sendSlashResponse(ctx, EmbedUtils.embedColor.OK, response.title, response.footer, "Available parameters: " + response.parameters.map(c => `\`${c}\``).join(', '))
        }
    }
}

function isCommand(input: Command | CommandParemeters): input is Command { //magic happens here
    return (<CommandParemeters>input).parameters == undefined;
}

export default ArgDirCommand