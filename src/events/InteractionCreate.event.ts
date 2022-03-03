import { CommandInteraction, Interaction } from "discord.js";
import { Event } from "../handlers/EventHandler";

export default class InteractionCreate extends Event<"interactionCreate"> {
    public event: "interactionCreate" = "interactionCreate";

    public run(interaction: Interaction) {
        if (interaction.isCommand())
            return this.client.commands.runCommand(
                interaction as CommandInteraction
            );
    }
}
