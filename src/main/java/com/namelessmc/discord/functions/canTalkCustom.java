package com.namelessmc.discord.functions;

import com.namelessmc.discord.Bot;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.entities.TextChannel;

import java.util.concurrent.TimeUnit;

public class canTalkCustom {
    public static boolean canTalk(TextChannel textChannel) {
        if (!textChannel.canTalk(textChannel.getGuild().getSelfMember())) {
            return false;
        } else {
            boolean isAllowed = false;
            for (String prefix : Bot.ALLOWED_CHANNEL_PREFIXES) {
                if (textChannel.getName().toLowerCase().startsWith(prefix)) {
                    isAllowed = true;
                }
            }
            if (isAllowed) {
                return true;
            } else {
                EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("No Bots Allowed").setColor(Bot.EMBED_COLOR)
                        .setDescription("The bot can't be used in this channel!");
                textChannel.sendMessage(embedBuilder.build()).complete().delete().queueAfter(3, TimeUnit.SECONDS);
                return false;
            }
        }
    }

    public static boolean canTalk(TextChannel textChannel, Boolean bypassChannelRestriction) {
        if (!textChannel.canTalk(textChannel.getGuild().getSelfMember())) {
            return false;
        } else {
            if (bypassChannelRestriction) {
                return true;
            } else {
                boolean isAllowed = false;
                for (String prefix : Bot.ALLOWED_CHANNEL_PREFIXES) {
                    if (textChannel.getName().startsWith(prefix)) {
                        isAllowed = true;
                    }
                }
                if (isAllowed) {
                    return true;
                } else {
                    EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("No Bots Allowed").setColor(Bot.EMBED_COLOR)
                            .setDescription("The bot can't be used in this channel!");
                    textChannel.sendMessage(embedBuilder.build()).complete().delete().queueAfter(3, TimeUnit.SECONDS);
                    return false;
                }
            }
        }
    }
}
