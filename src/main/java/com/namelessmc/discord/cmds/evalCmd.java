package com.namelessmc.discord.cmds;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.PermissionsCustom;
import com.namelessmc.discord.functions.canTalkCustom;
import com.namelessmc.discord.functions.evalFunction;
import com.namelessmc.discord.functions.messageAddons;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class evalCmd extends ListenerAdapter {
    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot() | event.getAuthor().isFake()) {
            return;
        }
        if (PermissionsCustom.hasBotAdmin(event.getAuthor())) {
            if (event.getMessage().getContentRaw().startsWith(Bot.BOT_PREFIX + "eval")) {
                String footerText = messageAddons.footerMessage(event);
                if (canTalkCustom.canTalk(event.getTextChannel())) {
                    evalFunction.executeFunction(event.getMessage().getContentRaw().split(" "), event);
                    messageAddons.hideMessage(event);
                }
            }
        } else {
            return;
        }
    }
}
