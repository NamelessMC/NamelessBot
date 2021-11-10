import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import getLatestCommitHash from "../../util/GetLatestCommitHash";
import { config } from "../../index";
import fetch from 'node-fetch';
import { HelpConfig } from "../../constants/types";
import EmbedUtils from "../../constants/EmbedUtil";

class HelpCommand {
    public command = new SlashCommandBuilder()
        .setName("help")
        .setDescription("If you don't know what to do? Let the bot tell you what to do !");

    public async execute(ctx: CommandInteraction) {

        // get the github data
        const latestCommitHash = await getLatestCommitHash();
        
        const githubURL = `https://raw.githubusercontent.com/${config.organizationName}/${config.repositoryName}/${latestCommitHash}/commands.json`;
        const response = await fetch(githubURL).then((res) => res.json()) as HelpConfig;

        const commands = response.commands;

        EmbedUtils.sendSlashResponse(ctx, EmbedUtils.embedColor.OK, "Help", "", commands.map(c => `**${c.aliases[0]}**: ${c.description}`).join('\n'))
    }
}

export default HelpCommand;