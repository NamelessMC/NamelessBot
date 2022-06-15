import { Command } from "@crystaldevelopment/command-handler/dist";
import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction, GuildMember } from "discord.js";
import { join } from "path";
import Bot from "../managers/Bot";

export default class extends Command {
    public name = "thread";
    public description = "Perform actions with threads";
    public defaultPermission = true;
    public options = [];

    public onStart(): void {
        this.loadSubcommandsFromDir(join(__dirname, "./thread"));
    }

    public onLoad(): void {
        null;
    }

    public async run(interaction: CommandInteraction) {
        if (!interaction.guild) {
            interaction.reply("This command can only be used in a server");
            return;
        }
        if (!(interaction.member instanceof GuildMember)) {
            interaction.reply("This command can only be used in a server");
            return;
        }

        const client = interaction.client as Bot;
        const senderIsStaff = interaction.member?.roles.cache.some((role) =>
            client.config.supportRoles.includes(role.id)
        );

        if (!senderIsStaff) {
            interaction.reply(
                "You need to be a staff member to use this command"
            );
            return;
        }

        await this.runSubcommand(interaction);
    }
}
