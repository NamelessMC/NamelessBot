package com.namelessmc.discord.cmds;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.canTalkCustom;
import com.namelessmc.discord.functions.messageAddons;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class cheeseCmd extends ListenerAdapter {
    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot() | event.getAuthor().isFake()) {
            return;
        }
        if (event.getMessage().getContentRaw().startsWith(Bot.BOT_PREFIX + "cheese")) {
            if (canTalkCustom.canTalk(event.getTextChannel())) {
                event.getChannel().sendMessage("Normal cheese: :cheese:\nSpace cheese: :cheesecubes:").queue();
            }
        }
    }
}
