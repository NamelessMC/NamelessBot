import { CommandInteraction, Interaction } from "discord.js";
import { Event } from "../handlers/EventHandler";
import StringSimilarity from "string-similarity";

export default class InteractionCreate extends Event<"interactionCreate"> {
    public event: "interactionCreate" = "interactionCreate";

    public run(interaction: Interaction) {
        if (interaction.isCommand())
            return this.client.commands.runCommand(
                interaction as CommandInteraction
            );

        if (
            interaction.isSelectMenu()
            && interaction.customId == "support-parameter"
        ) {
            const command = JSON.parse(
                this.client.github.getFileFromRepo(
                    `./commands/support/${interaction.values[0]}.json`
                )
            );
            if (!command) return;

            return interaction.reply({
                embeds: [this.client.embeds.MakeResponse(command)],
            });
        }

        if (
            interaction.isAutocomplete()
            && interaction.commandName == "support"
        ) {
            // Crude implementation of auto complete system
            const parameter = interaction.options.getString("parameter") || "";
            const commandInfo = JSON.parse(
                this.client.github.getFileFromRepo(`./commands/support.json`)
            );

            const matches = commandInfo.parameters.filter(
                (c: string) =>
                    StringSimilarity.compareTwoStrings(c, parameter) > 0.5
            );

            if (matches.length > 0) {
                return interaction.respond(
                    matches.map((c: string) => {
                        return {
                            name: c,
                            value: c,
                        };
                    })
                );
            }

            return interaction.respond(
                commandInfo.parameters.map((c: string) => {
                    return {
                        name: c,
                        value: c,
                    };
                })
            );
        }
    }
}
