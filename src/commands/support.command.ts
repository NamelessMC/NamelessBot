import { Command } from "@crystaldevelopment/command-handler/dist";
import { ApplicationCommandOptionType } from "discord-api-types";
import {
    ApplicationCommandOptionData,
    CommandInteraction,
    GuildMember,
} from "discord.js";
import Bot from "../managers/Bot";

export default class extends Command {
    public name = "support";
    public description = "Messages for common issues";
    public options: ApplicationCommandOptionData[] = [
        {
            name: "parameter",
            type: ApplicationCommandOptionType.String as number,
            description:
                "The parameter to query, leave blank for a list of all parameters",
        },
    ];

    public onStart(): void {
        null;
    }

    public onLoad(): void {
        null;
    }

    public async run(interaction: CommandInteraction): Promise<any> {
        const client = interaction.client as Bot;

        const parameter = interaction.options
            .getString("parameter")
            ?.toLowerCase();

        // Return a list of all parameters if none are given
        if (!parameter) {
            const commandInfo = JSON.parse(
                client.github.getFileFromRepo(`./commands/support.json`)
            );
            const embed = client.embeds
                .base()
                .setTitle(commandInfo.title)
                .setDescription(
                    "Available parameters: " +
                        commandInfo.parameters
                            .map((c: string) => `\`${c}\``)
                            .join(", ")
                );

            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        try {
            const command = JSON.parse(
                client.github.getFileFromRepo(
                    `./commands/support/${parameter}.json`
                )
            );
            if (!command) return;

            return interaction.reply({
                embeds: [client.embeds.MakeResponse(command)],
            });
        } catch {
            return interaction.reply({
                content: "That parameter doesn't exist",
                ephemeral: true,
            });
        }
    }
}
