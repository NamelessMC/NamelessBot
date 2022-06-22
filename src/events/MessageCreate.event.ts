import {
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import { Event } from "../handlers/EventHandler";
import { client } from "..";

export default class InteractionCreate extends Event<"messageCreate"> {
    public event = "messageCreate";

    public async run(msg: Message) {
        if (!msg.guild || msg.guild?.id !== this.client.config.guildID) return;

        // Stop thread creation messages
        if (
            msg.channel.id === this.client.config.supportChannelId
            && msg.embeds.length == 0
        ) {
            msg.delete();
        }

        // quick embed shit
        if (
            msg.content.toLowerCase().startsWith("!embed")
            && msg.member?.permissions.has("MANAGE_MESSAGES")
        ) {
            const embed = this.client.embeds.base();
            embed.setDescription(
                this.client.config.supportEmbedDescription.join("\n")
            );
            embed.setFooter({
                text: "By clicking the button you agree that any mesages posted in the thread will be licensed under cc by-nc-sa",
            });

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("get-support")
                    .setLabel("Create question")
                    .setStyle("SUCCESS")
            );

            msg.channel.send({ embeds: [embed], components: [row] });
        }

        if (msg.content.toLowerCase().startsWith(">support")) {
            msg.reply(
                "This command has been removed in favor of the /support command. Use this instead!"
            );
        }

        if (
            !msg.member?.roles.cache.some((role) =>
                client.config.supportRoles.includes(role.id)
            )
        ) {
            return;
        }

        const regex =
            /<?https:\/\/([canary.]?)+discord.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})>?/gm;
        const matches = regex.exec(msg.content);
        if (!matches) {
            return;
        }

        if (matches[0].startsWith("<") && matches[0].endsWith(">")) {
            return;
        }

        const guildId = matches[2];
        const channelId = matches[3];
        const messageId = matches[4];

        // Check if the guild from the link is the same as the guild we are in
        if (msg.guild.id !== guildId) {
            return;
        }

        // Fetch the channel
        const channel = await msg.guild.channels.fetch(channelId).catch();
        if (!channel || !(channel instanceof TextChannel)) {
            return;
        }

        // Check if the user can view the channel
        if (!channel.permissionsFor(msg.member!)?.has("VIEW_CHANNEL")) {
            return;
        }

        const message = await channel.messages.fetch(messageId);
        if (!message) {
            return;
        }

        // If embed, send embed
        if (message.embeds[0]) {
            msg.channel.send({ embeds: [message.embeds[0]] });
            return;
        }

        // Send message content
        const embed = new MessageEmbed()
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL({ dynamic: true }) || "",
            })
            .setTimestamp(message.createdTimestamp)
            .setDescription(message.content)
            .setFooter({ text: `Sent in: #${channel.name}` })
            .setColor("#FBBF24");

        msg.channel.send({ embeds: [embed] });
    }
}
