import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Event } from "../handlers/EventHandler";
import { client } from "..";

export default class InteractionCreate extends Event<"messageCreate"> {
    public event = "messageCreate";

    public async run(msg: Message) {
        if (!msg.guild || msg.guild?.id !== this.client.config.guildID) return;

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
        const messageID = matches[4];

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

        const message = await channel.messages.fetch(messageID);
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
