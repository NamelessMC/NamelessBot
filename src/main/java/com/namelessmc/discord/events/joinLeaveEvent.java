package com.namelessmc.discord.events;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.canTalkCustom;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.entities.Member;
import net.dv8tion.jda.core.entities.TextChannel;
import net.dv8tion.jda.core.entities.User;
import net.dv8tion.jda.core.events.guild.member.GuildMemberJoinEvent;
import net.dv8tion.jda.core.events.guild.member.GuildMemberLeaveEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class joinLeaveEvent extends ListenerAdapter {
    @Override
    public void onGuildMemberJoin(GuildMemberJoinEvent event) {
        if (!event.getUser().isBot() && !event.getUser().isBot()) {
            User eventUser = event.getUser();
            String cleanUsername = eventUser.getName().replace("`", "\\`");
            Integer memberCount = 0;
            for (Member member : event.getGuild().getMembers()) {
                if (!member.getUser().isBot() && !member.getUser().isFake()) {
                    memberCount++;
                }
            }
            if (event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).size() > 0) {
                TextChannel welcomeChannel = event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).get(0);
                if (canTalkCustom.canTalk(welcomeChannel, true)) {
                    EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("User Join").setColor(Bot.EMBED_COLOR_GREEN)
                            .setDescription("Welcome ``" + cleanUsername + "#" + eventUser.getDiscriminator() + "`` to the NamelessMC Discord.")
                            .setFooter("There are now " + memberCount + " members.", null);
                    welcomeChannel.sendMessage(embedBuilder.build()).queue();
                }
            }
        }
    }

    @Override
    public void onGuildMemberLeave(GuildMemberLeaveEvent event) {
        if (!event.getUser().isBot() && !event.getUser().isBot()) {
            User eventUser = event.getUser();
            String cleanUsername = eventUser.getName().replace("`", "\\`");
            Integer memberCount = 0;
            for (Member member : event.getGuild().getMembers()) {
                if (!member.getUser().isBot() && !member.getUser().isFake()) {
                    memberCount++;
                }
            }
            if (event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).size() > 0) {
                TextChannel welcomeChannel = event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).get(0);
                if (canTalkCustom.canTalk(welcomeChannel, true)) {
                    EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("User Leave").setColor(Bot.EMBED_COLOR_RED)
                            .setDescription("Goodbye ``" + cleanUsername + "#" + eventUser.getDiscriminator() + "``. Thanks for visiting the NamelessMC Discord.")
                            .setFooter("There are now " + memberCount + " members.", null);
                    welcomeChannel.sendMessage(embedBuilder.build()).queue();
                }
            }
        }
    }
}
