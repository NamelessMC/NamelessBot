import { ApplicationCommandOptionType } from "discord-api-types";
import { Subcommand } from "@crystaldevelopment/command-handler/dist";
import {
    ApplicationCommandOptionData,
    CommandInteraction,
    GuildMember,
} from "discord.js";

export default class extends Subcommand {
    public name = "settitle";
    public description = "Set the title of a thread";
    public options: ApplicationCommandOptionData[] = [
        {
            type: ApplicationCommandOptionType.String as number,
            name: "title",
            description: "The new title for the thread",
            required: true,
        },
    ];

    public onStart(): void {
        null;
    }

    public onLoad(): void {
        null;
    }

    public async run(interaction: CommandInteraction): Promise<any> {
        if (!interaction.guild || !(interaction.member instanceof GuildMember))
            return; // Its definitly defined

        if (!interaction.channel?.isThread())
            return interaction.reply(
                "This command can only be used in a thread"
            );

        const title = interaction.options.getString("title")!;
        await interaction.channel.setName(title);
        interaction.reply({ content: "Thread title set", ephemeral: true });
    }
}
