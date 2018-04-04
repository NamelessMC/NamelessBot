package com.namelessmc.discord.cmds;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.PermissionsCustom;
import com.namelessmc.discord.functions.canTalkCustom;
import com.namelessmc.discord.functions.messageAddons;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

import java.util.concurrent.TimeUnit;

public class byeCmd extends ListenerAdapter {
    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot() | event.getAuthor().isFake()) {
            return;
        }
        if (PermissionsCustom.hasBotAdmin(event.getAuthor())) {
            if (event.getMessage().getContentRaw().startsWith(Bot.BOT_PREFIX + "bye")) {
                String footerText = messageAddons.footerMessage(event);
                if (canTalkCustom.canTalk(event.getTextChannel())) {
                    EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("Bye").setColor(Bot.EMBED_COLOR)
                            .setDescription("The bot is shutting down! Panic!")
                            .setFooter(footerText, null);
                    event.getChannel().sendMessage(embedBuilder.build()).queue();
                    messageAddons.hideMessage(event);
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.exit(0);
                }
            }
        } else {
            return;
        }
    }
}
