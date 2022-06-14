import {
    Interaction,
    MessageActionRow,
    Modal,
    ModalActionRowComponent,
    TextChannel,
    TextInputComponent,
} from "discord.js";
import { Event } from "../handlers/EventHandler";

export default class InteractionCreate extends Event<"interactionCreate"> {
    public event = "interactionCreate";

    public async run(interaction: Interaction) {
        if (interaction.isButton()) {
            const buttonId = interaction.customId;
            if (buttonId === "get-support") {
                const modal = new Modal();
                modal.setCustomId("support-modal");
                modal.setTitle("New support request");

                const titleInput = new TextInputComponent();
                titleInput.setCustomId("support-title");
                titleInput.setLabel("Issue");
                titleInput.setStyle("SHORT");

                const descriptionInput = new TextInputComponent();
                descriptionInput.setCustomId("support-description");
                descriptionInput.setLabel("Description");
                descriptionInput.setStyle("PARAGRAPH");

                const firstActionRow =
                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                        titleInput
                    );
                const secondActionRow =
                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                        descriptionInput
                    );

                modal.addComponents(firstActionRow, secondActionRow);
                await interaction.showModal(modal);
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "support-modal") {
                const title =
                    interaction.fields.getTextInputValue("support-title");
                const description = interaction.fields.getTextInputValue(
                    "support-description"
                );

                if (title.length == 0 || description.length == 0) {
                    interaction.reply({
                        content: "Please fill out all fields!",
                        ephemeral: true,
                    });
                    return;
                }

                const channel = interaction.channel as TextChannel;
                const thread = await channel.threads.create({
                    name: title,
                    autoArchiveDuration: "MAX",
                    reason: "Support request created by " + interaction.user.id,
                });

                // Add user to thread
                await thread.members.add(interaction.user);
                const embed = this.client.embeds.base();
                embed.setDescription(description);

                await thread.send(description);

                interaction.reply({
                    content:
                        "Your support request has been created! View your thread here: "
                        + thread.toString(),
                    ephemeral: true,
                });
            }
        }
    }
}
