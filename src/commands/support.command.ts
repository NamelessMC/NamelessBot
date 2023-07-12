import { Command } from "@crystaldevelopment/command-handler/dist";
import { ApplicationCommandOptionType } from "discord-api-types";
import {
    ApplicationCommandOptionData,
    CommandInteraction,
    MessageActionRow,
    MessageSelectMenu,
} from "discord.js";
import Bot from "../managers/Bot";
import StringSimilarity from "../util/StringSimilarity";

export default class extends Command {
    public name = "support";
    public description = "Messages for common issues";
    public options: ApplicationCommandOptionData[] = [
        {
            name: "parameter",
            type: ApplicationCommandOptionType.String as number,
            description:
                "The parameter to query, leave blank for a list of all parameters",
            autocomplete: true,
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

        const commandInfo = JSON.parse(
            client.github.getFileFromRepo(`./commands/support.json`)
        );

        // Return a list of all parameters if none are given
        if (!parameter) {
            const embed = client.embeds
                .base()
                .setTitle(commandInfo.title)
                .setDescription(
                    "Available parameters: "
                        + commandInfo.parameters
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
            const matches = commandInfo.parameters.filter(
                (c: string) =>
                    StringSimilarity(c, parameter) > 0.5
            );

            if (matches.length > 1) {
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("support-parameter")
                        .setPlaceholder("Select a parameter")
                        .addOptions(
                            matches.map((c: string) => {
                                return {
                                    label: c,
                                    description: `Select paremeter ${c}`,
                                    value: c,
                                };
                            })
                        )
                );
                interaction.reply({
                    content: "That parameter doesn't exist. Did you mean:",
                    components: [row],
                    ephemeral: true,
                });
            } else if (matches.length == 1) {
                const command = JSON.parse(
                    client.github.getFileFromRepo(
                        `./commands/support/${matches[0]}.json`
                    )
                );
                if (!command) return;

                return interaction.reply({
                    embeds: [client.embeds.MakeResponse(command)],
                });
            } else {
                interaction.reply({
                    content: "That parameter doesn't exist",
                    ephemeral: true,
                });
            }
        }
    }
}
