package com.namelessmc.discord.functions;

import net.dv8tion.jda.core.Permission;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

import java.util.Arrays;

public class messageAddons {
    public static Boolean isGoingToHide(MessageReceivedEvent event) {
        if (event.getMessage().getContentRaw().contains(" ")) {
            String[] splitMessage = event.getMessage().getContentRaw().split(" ");
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("-hide")) {
                if (event.getMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
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
                if (event.getMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    event.getMessage().delete().queue();
                }
            }
        }
    }

    public static String footerMessage(MessageReceivedEvent event) {
        if (event.getMessage().getContentRaw().contains(" ")) {
            String[] splitMessage = event.getMessage().getContentRaw().split(" ");
            if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1).equalsIgnoreCase("-hide")) {
                if (event.getMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                    return "Requested by " + event.getAuthor().getName() + "#" + event.getAuthor().getDiscriminator() + " with auto-hide.";
                }
            }
        }
        return "Requested by " + event.getAuthor().getName() + "#" + event.getAuthor().getDiscriminator();
    }
}
