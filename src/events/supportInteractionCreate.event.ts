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
    MessageActionRowComponent,
    GuildMemberRoleManager,
    GuildMember,
} from "discord.js";
import { Event } from "../handlers/EventHandler";
import AutoResponseManager from "../managers/AutoResponseManager";
import { nanoid } from "nanoid";
import StatisticsManager from "../managers/StatisticsManager";
import { ThreadAutoArchiveDuration } from "discord-api-types/v9";
import Thread from "../models/Thread.js";

type issue = {
    title: string;
    content: string;
    debug_link: string;
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

                const debugLinkInput = new TextInputComponent();
                debugLinkInput.setCustomId("debug-link");
                debugLinkInput.setLabel(
                    "Debug link (Configuration -> Maintenance)"
                );
                debugLinkInput.setStyle("SHORT");
                debugLinkInput.setRequired(false);

                const firstActionRow =
                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                        titleInput
                    );
                const secondActionRow =
                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                        descriptionInput
                    );
                const thirdActionRow =
                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                        debugLinkInput
                    );

                modal.addComponents(
                    firstActionRow,
                    secondActionRow,
                    thirdActionRow
                );
                await interaction.showModal(modal);
            }

            if (buttonId === "debug-link") {
                if (
                    !interaction.channel
                    || !interaction.member
                    || !(
                        interaction.member.roles
                        instanceof GuildMemberRoleManager
                    )
                )
                    return;
                if (
                    !(
                        interaction.member.roles as GuildMemberRoleManager
                    ).cache.some((role) =>
                        this.client.config.supportRoles.includes(role.id)
                    )
                ) {
                    interaction.reply({
                        content: "You cannot do this!",
                        ephemeral: true,
                    });
                    return;
                }
                const threadId = interaction.channel.id;
                const messageId = interaction.message.id;

                const data = await Thread.findOne({
                    where: { messageId: messageId, threadId: threadId },
                });
                if (data) {
                    interaction.reply({
                        ephemeral: true,
                        content: data.debugLink,
                    });
                }
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "support-modal") {
                const title =
                    interaction.fields.getTextInputValue("support-title");
                const description = interaction.fields.getTextInputValue(
                    "support-description"
                );
                const debug_link =
                    interaction.fields.getTextInputValue("debug-link");

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
                        debug_link: debug_link,
                    });

                    StatisticsManager.SaveResponse(
                        autoResponseManager.result!,
                        interaction.channel as GuildChannel
                    ); // Statistics
                    StatisticsManager.IncreaseStatistic("AutoResponseCount");
                    StatisticsManager.IncreaseStatistic(
                        "AutoResponsePreThreadCreate"
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

                this.CreateThread(interaction, title, description, debug_link);
            }
        }

        if (
            interaction.isButton()
            && buttonToContentMap.has(interaction.customId)
        ) {
            const { title, content, debug_link } = buttonToContentMap.get(
                interaction.customId
            )!;
            this.CreateThread(interaction, title, content, debug_link);
            buttonToContentMap.delete(interaction.customId);
        }
    }
    private async CreateThread(
        interaction: ModalSubmitInteraction | ButtonInteraction,
        title: string,
        content: string,
        debug_link: string
    ) {
        await interaction.deferReply({ ephemeral: true });
        StatisticsManager.IncreaseThreadCreate(); // Statistics
        StatisticsManager.IncreaseStatistic("ThreadCount");

        const channel = interaction.channel as TextChannel;
        const thread = await channel.threads.create({
            name: title,
            autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
            reason: "Support request created by " + interaction.user.id,
        });

        // Add user to thread
        await thread.members.add(interaction.user);
        await thread.send(`<@&${this.client.config.supportMentionRoleId}>`);

        let sentMsg = await thread.send(content);
        sentMsg.author = interaction.user;
        sentMsg.content = title + "\n\n" + sentMsg.content;

        // Only if debug link
        if (debug_link && debug_link.length > 0) {
            const embed = this.client.embeds.base();
            embed.setFooter(null);
            embed.setDescription("A debug link was supplied with this thread");
            const btn = new MessageButton();
            btn.setCustomId("debug-link");
            btn.setLabel("View debug link");
            btn.setStyle("PRIMARY");

            const row = new MessageActionRow<MessageActionRowComponent>();
            row.addComponents(btn);
            const msg = await thread.send({
                embeds: [embed],
                components: [row],
            });
            await msg.pin();

            await Thread.create({
                threadId: thread.id,
                debugLink: debug_link,
                messageId: msg.id,
            });
        }

        this.client.emit("messageCreate", sentMsg); // Emit messageCreate event to run debug link checks
        interaction.editReply({
            content:
                "Your support request has been created! View your thread here: "
                + thread.toString(),
        });
    }
}
