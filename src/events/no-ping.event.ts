import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Event } from "../handlers/EventHandler";
import { client } from "..";

export default class InteractionCreate extends Event<"messageCreate"> {
    public event = "messageCreate";

    public async run(msg: Message) {
        if (
            !msg.guild
            || msg.guild?.id !== this.client.config.guildID
            || msg.mentions.members?.size === 0
            || msg.reference !== null
            || msg.member?.user.bot
        )
            return;

        const senderIsStaff = msg.member?.roles.cache.some((role) =>
            this.client.config.supportRoles.includes(role.id)
        );

        if (senderIsStaff) {
            return;
        }

        const mentionsStaff = msg.mentions.members?.some((member) =>
            member.roles.cache.some((role) =>
                this.client.config.supportRoles.includes(role.id)
            )
        );

        if (mentionsStaff) {
            await msg.channel.send(
                `Hey ${
                    msg.member?.nickname ?? msg.author.username
                }! Please don't tag support members directly.`
            );
        }
    }
}
