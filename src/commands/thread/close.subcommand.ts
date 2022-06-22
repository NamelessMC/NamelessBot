import { Subcommand } from "@crystaldevelopment/command-handler/dist";
import {
    ApplicationCommandOptionData,
    CommandInteraction,
    GuildMember,
} from "discord.js";

export default class extends Subcommand {
    public name = "close";
    public description = "Close a thread";
    public options: ApplicationCommandOptionData[] = [];

    public onStart(): void {
        null;
    }

    public onLoad(): void {
        null;
    }

    public async run(interaction: CommandInteraction): Promise<any> {
        if (!interaction.guild || !(interaction.member instanceof GuildMember))
            return; // Its definitely defined

        if (!interaction.channel?.isThread())
            return interaction.reply(
                "This command can only be used in a thread"
            );

        await interaction.reply({ content: "Thread closed", ephemeral: true });
        await interaction.channel.setLocked(true, "Thread closed");
        await interaction.channel.setArchived(true, "Thread closed");
    }
}
