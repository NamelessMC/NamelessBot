import { CommandInteraction } from "discord.js";
import GetLatestCommitHash from "../../util/GetLatestCommitHash";
import Cache from '../../cache/Cache';
import { Command, CommandParemeters } from "../../constants/types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { config } from "../../index";
import fetch from "node-fetch";
import EmbedUtils from "../../constants/EmbedUtil";

const CommandCache = new Cache<Command>();

class BasicCommand {

    constructor(name: string, description: string) {
        this.command.setName(name.toLowerCase());
        this.command.setDescription(description);
    }

    public command = new SlashCommandBuilder();

    public async execute(ctx: CommandInteraction) {

        const commandName = this.command.name;

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

    public async handleResponse(ctx: CommandInteraction, response: Command) {
        EmbedUtils.sendSlashResponse(ctx, EmbedUtils.embedColor.OK, response.title, response.footer, response.body.join('\n'));
    }
}

export default BasicCommand