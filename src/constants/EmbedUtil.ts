import { ColorResolvable, CommandInteraction, Message, MessageEmbed } from "discord.js";

interface EmbedColors {
    [key: string]: ColorResolvable
}
export default class EmbedUtils {

    public static embedColor: EmbedColors = {
        'OK': '#0275D8',
        'SUCCESS': '#03D63E',
        'ERROR': '#D60334'
    }

    static async sendSlashResponse(ctx: CommandInteraction, color: ColorResolvable, title: string, footer: string, body: string) {
        if (!ctx.guild?.me?.permissions.has("SEND_MESSAGES")) {
            return;
        }

        if (!ctx.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        }

        const embed = new MessageEmbed();
        embed.setColor(color);
        if (title.length > 0) embed.setTitle(title);
        if (footer.length > 0) embed.setFooter(footer);
        embed.setDescription(body);

        // Surround in try/catch to prevent Unknown interaction errors from killing the bot. These randomly occur for no reason...
        try {
            ctx.deferred ? await ctx.editReply({ embeds: [ embed ]}) : await ctx.reply({ embeds: [ embed ]});
        } catch (ignored: any) {
            console.log("Something went wrong while responding to a slash command", ignored.message)
        }
    }

    static async sendResponse(msg: Message, color: ColorResolvable, title: string, footer: string, body: string) {
        if (!msg.guild?.me?.permissions.has("SEND_MESSAGES")) {
            return;
        }

        if (!msg.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        }

        const embed = new MessageEmbed();
        embed.setColor(color);
        if (title.length > 0) embed.setTitle(title);
        if (footer.length > 0) embed.setFooter(footer);
        embed.setDescription(body);

        // Surround in try/catch to prevent Unknown interaction errors from killing the bot. These randomly occur for no reason...
        try {
            msg.channel.send({ embeds: [ embed ]});
        } catch (ignored: any) {
            console.log("Something went wrong while sending a message", ignored.message)
        }
    }
}