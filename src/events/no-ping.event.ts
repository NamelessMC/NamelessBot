import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Event } from "../handlers/EventHandler";
import { client } from "..";
import PingCount from "../models/PingCount";

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
            // Check how many times they've pinged a staffmember before
            let [pingInfo, _created] = await PingCount.findOrCreate({
                where: { userId: msg.author.id },
                defaults: {
                    userId: msg.author.id,
                },
            });

            pingInfo.count++;
            await pingInfo.save();

            await msg.channel.send(
                `Hey ${
                    msg.member?.nickname ?? msg.author.username
                }! Please don't tag staff members directly. This is the ${getNumberWithOrdinal(
                    pingInfo.count
                )} time!`
            );
        }
    }
}

// Yoinked from Shopify
function getNumberWithOrdinal(n: number) {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
