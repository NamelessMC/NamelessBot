package com.namelessmc.bot.types;

import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.Permission;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

public abstract class BotCommandType {

    public String[] aliases;

    public abstract void execute(MessageReceivedEvent event, String latestCommit, String command, String[] args);

    public void sendBackMessage(MessageReceivedEvent event, MessageColor color, String title, String footer, String body) {
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
