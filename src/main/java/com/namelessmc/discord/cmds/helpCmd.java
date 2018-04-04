package com.namelessmc.discord.cmds;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.canTalkCustom;
import com.namelessmc.discord.functions.messageAddons;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class helpCmd extends ListenerAdapter {
    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot() | event.getAuthor().isFake()) {
            return;
        }
        if (event.getMessage().getContentRaw().startsWith(Bot.BOT_PREFIX + "help")) {
            String footerText = messageAddons.footerMessage(event);
            if (canTalkCustom.canTalk(event.getTextChannel())) {
                EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("Help (Prefix is " + Bot.BOT_PREFIX + ")").setColor(Bot.EMBED_COLOR)
                        .setDescription(
                                "**help**: Display this message.\n" +
                                "**support [optional: parameter]**: Get quick support on common issues.\\*\n" +
                                "**bye**: Shut down the bot. *Admins Only*\n" +
                                "\\**Add a parameter ``-hide`` to the end to auto-delete your message*"
                        ).setFooter(footerText, null);
                event.getChannel().sendMessage(embedBuilder.build()).queue();
                messageAddons.hideMessage(event);
            }
        }
    }
}
