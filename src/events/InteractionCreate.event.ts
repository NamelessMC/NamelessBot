import { CommandInteraction, Interaction } from "discord.js";
import { Event } from "../handlers/EventHandler";

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
    }
}
