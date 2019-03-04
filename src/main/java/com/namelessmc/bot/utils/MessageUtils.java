package com.namelessmc.bot.utils;

import com.namelessmc.bot.NamelessBot;
import com.namelessmc.bot.types.MessageColor;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.Permission;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

public class MessageUtils {

    public static String sanitize(String message) {
        message = message.replace("@everyone", "<everyone>");
        message = message.replace("@here", "<here>");
        message = message.replace(NamelessBot.jda.getToken(), "<token>");
        message = message.replace("`", "");
        message = message.replace("\\", "");
        return message;
    }

    public static void sendBackMessage(MessageReceivedEvent event, MessageColor color, String title, String footer, String body) {
        if (!event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_WRITE)) {
            return;
        }
        if (!event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_EMBED_LINKS)) {
            return;
        }
        EmbedBuilder embedBuilder = new EmbedBuilder();
        embedBuilder.setColor(color.color);
        if (title != null && !title.equals("")) {
            embedBuilder.setTitle(title);
        }
        if (footer != null && !footer.equals("")) {
            embedBuilder.setFooter(footer, null);
        }
        embedBuilder.setDescription(body.replace("\n", System.lineSeparator()));
        event.getTextChannel().sendMessage(embedBuilder.build()).queue();
    }
}
