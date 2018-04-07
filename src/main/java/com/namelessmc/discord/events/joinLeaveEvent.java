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
            String footerText = "There are now " + memberCount + " members.";
            Integer membersToGo = 1000 - memberCount;
            if (membersToGo > 0) {
                if (membersToGo == 1) {
                    footerText = footerText + " (" + membersToGo + " more member until 1,000!)";
                } else {
                    footerText = footerText + " (" + membersToGo + " more members until 1,000.)";
                }
            } else if (membersToGo > 0) {
                membersToGo = membersToGo * -1;
                if (membersToGo == 1) {
                    footerText = footerText + " (We now have " + membersToGo + " more member than 1,000!)";
                } else {
                    footerText = footerText + " (We now have " + membersToGo + " more members than 1,000!)";
                }
            } else {
                footerText = footerText + " (We've hit 1000 members! :tada: )";
            }
            if (event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).size() > 0) {
                TextChannel welcomeChannel = event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).get(0);
                if (canTalkCustom.canTalk(welcomeChannel, true)) {
                    EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("User Join").setColor(Bot.EMBED_COLOR_GREEN)
                            .setDescription("Welcome ``" + cleanUsername + "#" + eventUser.getDiscriminator() + "`` to the NamelessMC Discord.")
                            .setFooter(footerText, null);
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
            String footerText = "There are now " + memberCount + " members.";
            Integer membersToGo = 1000 - memberCount;
            if (membersToGo > 0) {
                if (membersToGo == 1) {
                    footerText = footerText + " (" + membersToGo + " more member until 1,000!)";
                } else {
                    footerText = footerText + " (" + membersToGo + " more members until 1,000.)";
                }
            } else if (membersToGo > 0) {
                membersToGo = membersToGo * -1;
                if (membersToGo == 1) {
                    footerText = footerText + " (We now have " + membersToGo + " more member than 1,000!)";
                } else {
                    footerText = footerText + " (We now have " + membersToGo + " more members than 1,000!)";
                }
            } else {
                footerText = footerText + " (We've hit 1000 members! :tada: )";
            }
            if (event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).size() > 0) {
                TextChannel welcomeChannel = event.getGuild().getTextChannelsByName(Bot.WELCOME_MESSAGE_CHANNEL, true).get(0);
                if (canTalkCustom.canTalk(welcomeChannel, true)) {
                    EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("User Leave").setColor(Bot.EMBED_COLOR_RED)
                            .setDescription("Goodbye ``" + cleanUsername + "#" + eventUser.getDiscriminator() + "``. Thanks for visiting the NamelessMC Discord.")
                            .setFooter(footerText, null);
                    welcomeChannel.sendMessage(embedBuilder.build()).queue();
                }
            }
        }
    }
}
