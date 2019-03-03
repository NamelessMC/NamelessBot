package com.namelessmc.bot.commands;

import com.namelessmc.bot.types.BotCommand;
import com.namelessmc.bot.types.MessageColor;
import com.namelessmc.bot.types.PermissionLevel;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

import java.util.concurrent.TimeUnit;

public class ByeCommand extends BotCommand {

    public ByeCommand() {
        super(PermissionLevel.ADMIN, new String[]{"bye"});
    }

    @Override
    public void execute(MessageReceivedEvent event, String aliasUsed, String[] args) {
        sendBackMessage(event, MessageColor.SUCCESS, "Bye", "Ahhhhhh!", "The bot is shutting down! Panic!");
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.exit(0);
    }
}
