package com.namelessmc.discord.functions;

import com.namelessmc.discord.Bot;
import net.dv8tion.jda.core.Permission;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

import java.util.Arrays;

public class messageAddons {
    public static Boolean isGoingToHide(MessageReceivedEvent event) {
        if (event.getMessage().getContentRaw().contains(" ")) {
            String[] splitMessage = event.getMessage().getContentRaw().split(" ");
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("-hide")) {
                if (event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    return true;
                }
            }
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("//hide")) {
                if (event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void hideMessage(MessageReceivedEvent event) {
        if (event.getMessage().getContentRaw().contains(" ")) {
            String[] splitMessage = event.getMessage().getContentRaw().split(" ");
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("-hide")) {
                if (event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    event.getMessage().delete().queue();
                }
            }
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("//hide")) {
                if (event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    event.getMessage().delete().queue();
                }
            }
        }
    }

    public static String footerMessage(MessageReceivedEvent event) {
        if (event.getMessage().getContentRaw().contains(" ")) {
            String[] splitMessage = event.getMessage().getContentRaw().split(" ");
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("-hide")) {
                if (event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    return "Requested by " + event.getAuthor().getName() + "#" + event.getAuthor().getDiscriminator() + " with auto-hide.";
                }
            }
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("//hide")) {
                if (event.getGuild().getSelfMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    return "Requested by " + event.getAuthor().getName() + "#" + event.getAuthor().getDiscriminator() + " with auto-hide.";
                }
            }
        }
        return "Requested by " + event.getAuthor().getName() + "#" + event.getAuthor().getDiscriminator();
    }

    public static String sanitizeMessage(String string, Boolean forCodeBlock) {
        if (forCodeBlock) {
            String finalString = string;
            finalString = finalString.replace(Bot.jda.getToken(), "<Token Removed>");
            finalString = finalString.replace("`", "\\`");
            finalString = finalString.replace("@everyone", "<Everyone Mention>");
            return finalString;
        } else {
            String finalString = string;
            finalString = finalString.replace(Bot.jda.getToken(), "<Token Removed>");
            finalString = finalString.replace("~", "\\~");
            finalString = finalString.replace("`", "\\`");
            finalString = finalString.replace("*", "\\*");
            finalString = finalString.replace("_", "\\_");
            finalString = finalString.replace("@everyone", "<Everyone Mention>");
            return finalString;
        }
    }
}
