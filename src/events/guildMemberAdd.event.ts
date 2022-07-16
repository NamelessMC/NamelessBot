import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { Event } from "../handlers/EventHandler";

export default class InteractionCreate extends Event<"guildMemberAdd"> {
    public event = "guildMemberAdd";

    public async run(member: GuildMember) {
        if (member.user.bot) {
            return;
        }

        const cleanedUsername = markdownEscape(member.user.username);

        const members = await member.guild.members.fetch();
        const memberCount = members.filter((c) => !c.user.bot).size;

        const channel = (await member.guild.channels.fetch(
            this.client.config.welcomeChannelId
        )) as TextChannel;
        if (!channel) {
            return;
        }

        const embed = this.client.embeds.base();
        embed.setTitle("User Join");
        embed.setDescription(
            `Welcome \`${cleanedUsername}#${member.user.discriminator}\` to the NamelessMC Discord.`
        );
        embed.setFooter({ text: `There are now ${memberCount} members.` });

        await channel
            .send({ embeds: [embed] })
            .catch((ignored) =>
                this.client.logger.error("Something went wrong while sending the welcome message")
            );
    }
}

function markdownEscape(text: string) {
    return text.replace(/((\_|\*|\~|\`|\|){2})/g, "\\$1");
}
