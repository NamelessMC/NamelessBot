import {
    Interaction,
    MessageActionRow,
    Modal,
    ModalActionRowComponent,
    TextChannel,
    TextInputComponent,
    Collection,
    MessageButton,
    ModalSubmitInteraction,
    ButtonInteraction,
    GuildChannel,
} from "discord.js";
import { Event } from "../handlers/EventHandler";
import AutoResponseManager from "../managers/AutoResponseManager";
import { nanoid } from "nanoid";
import StatisticsManager from "../managers/StatisticsManager";

type issue = {
    title: string;
    content: string;
};

const buttonToContentMap = new Collection<string, issue>();

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
                titleInput.setRequired(true);
                titleInput.setMinLength(5);

                const descriptionInput = new TextInputComponent();
                descriptionInput.setCustomId("support-description");
                descriptionInput.setLabel("Description");
                descriptionInput.setStyle("PARAGRAPH");
                descriptionInput.setRequired(true);
                descriptionInput.setMinLength(10);

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

                // Check if we have an automatic response for their issue
                const autoResponseManager = new AutoResponseManager(
                    title + " " + description
                );
                await autoResponseManager.run();
                const autoResponse = autoResponseManager.getResponse();

                if (autoResponse) {
                    // Send this response. If they continue to have an issue, we can create a thread anyways
                    const buttonId = nanoid();
                    const row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId(buttonId)
                            .setLabel("Create thread anyways")
                            .setStyle("SUCCESS")
                    );

                    buttonToContentMap.set(buttonId, {
                        title,
                        content: description,
                    });

                    StatisticsManager.SaveResponse(
                        autoResponseManager.result!,
                        interaction.channel as GuildChannel
                    );

                    await interaction.reply({
                        ephemeral: true,
                        embeds: [autoResponse],
                        components: [row],
                        content:
                            "I've found the following for your issue. If this does not solve it, you can click the button below to still create a thread for your issue.",
                    });
                    return;
                }

                this.CreateThread(interaction, title, description);
            }
        }

        if (
            interaction.isButton()
            && buttonToContentMap.has(interaction.customId)
        ) {
            const { title, content } = buttonToContentMap.get(
                interaction.customId
            )!;
            this.CreateThread(interaction, title, content);
            buttonToContentMap.delete(interaction.customId);
        }
    }
    private async CreateThread(
        interaction: ModalSubmitInteraction | ButtonInteraction,
        title: string,
        content: string
    ) {
        const channel = interaction.channel as TextChannel;
        const thread = await channel.threads.create({
            name: title,
            autoArchiveDuration: "MAX",
            reason: "Support request created by " + interaction.user.id,
        });

        // Add user to thread
        await thread.members.add(interaction.user);
        const embed = this.client.embeds.base();
        embed.setDescription(content);

        await thread.send(`<@&${this.client.config.supportMentionRoleId}>`);

        let sentMsg = await thread.send(content);
        sentMsg.author = interaction.user;
        sentMsg.content = title + "\n\n" + sentMsg.content;
        this.client.emit("messageCreate", sentMsg); // Emit messageCreate event to run debug link checks

        interaction.reply({
            content:
                "Your support request has been created! View your thread here: "
                + thread.toString(),
            ephemeral: true,
        });
    }
}
