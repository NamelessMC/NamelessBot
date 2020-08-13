package com.namelessmc.bot.types;

import com.namelessmc.bot.utils.MessageUtils;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;

public abstract class BotCommandType {

    public String[] aliases;

    public abstract void execute(MessageReceivedEvent event, String latestCommit, String command, String[] args);

    public void sendBackMessage(MessageReceivedEvent event, MessageColor color, String title, String footer, String body) {
        MessageUtils.sendBackMessage(event, color, title, footer, body);
    }

}
