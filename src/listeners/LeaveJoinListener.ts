import { MessageEmbed, TextChannel } from 'discord.js';
import EmbedUtils from '../constants/EmbedUtil';
import { client, config } from '../index';

client.on('guildMemberAdd', async (member) => {

    if (member.user.bot) {
        return;
    }

    const cleanedUsername = markdownEscape(member.user.username);

    const members = await member.guild.members.fetch();
    const memberCount = members.filter(c => !c.user.bot).size;

    const channel = await member.guild.channels.fetch(config.welcomeChannelId) as TextChannel;
    if (!channel) {
        return;
    }

    const embed = new MessageEmbed();
    embed.setColor(EmbedUtils.embedColor.SUCCESS);
    embed.setTitle("User Join");
    embed.setDescription(`Welcome \`${cleanedUsername}#${member.user.discriminator}\` to the NamelessMC Discord.`);
    embed.setFooter(`There are now ${memberCount} members.`);

    await channel.send({ embeds: [ embed ]}).catch(ignored => console.log("Something went wrong while sending the welcome message"));
})

client.on('guildMemberRemove', async (member) => {
    if (member.partial) member = await member.fetch();

    if (member.user.bot) {
        return;
    }

    const cleanedUsername = markdownEscape(member.user.username);

    const members = await member.guild.members.fetch();
    const memberCount = members.filter(c => !c.user.bot).size;

    const channel = await member.guild.channels.fetch(config.welcomeChannelId) as TextChannel;
    if (!channel) {
        return;
    }

    const embed = new MessageEmbed();
    embed.setColor(EmbedUtils.embedColor.ERROR);
    embed.setTitle("User Leave");
    embed.setDescription(`Goodbye \`${cleanedUsername}#${member.user.discriminator}\`. Thanks for visiting the NamelessMC Discord.`);
    embed.setFooter(`There are now ${memberCount} members.`);

    await channel.send({ embeds: [ embed ]}).catch(ignored => console.log("Something went wrong while sending the welcome message"));
})

function markdownEscape(text: string) {
    return text.replace(/((\_|\*|\~|\`|\|){2})/g, '\\$1');
 };