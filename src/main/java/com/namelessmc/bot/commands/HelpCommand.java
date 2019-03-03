package com.namelessmc.bot.commands;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.namelessmc.bot.NamelessBot;
import com.namelessmc.bot.types.BotCommand;
import com.namelessmc.bot.types.MessageColor;
import com.namelessmc.bot.types.PermissionLevel;
import com.namelessmc.bot.utils.FetchJson;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

public class HelpCommand extends BotCommand {

    public HelpCommand() {
        super(PermissionLevel.MEMBER, new String[]{"help"});
    }

    @Override
    public void execute(MessageReceivedEvent event, String aliasUsed, String[] args) {
        JsonObject githubJson = FetchJson.fromUrl("https://api.github.com/repos/NamelessMC/BotConfiguration/commits/" + NamelessBot.BRANCH);
        String commitHash = githubJson.get("sha").getAsString();

        StringBuilder stringBuilder = new StringBuilder();

        JsonObject commands = FetchJson.fromUrl("https://raw.githubusercontent.com/NamelessMC/BotConfiguration/" + commitHash + "/commands.json");
        JsonArray commandsArray = commands.get("commands").getAsJsonArray();
        for (JsonElement commandElement : commandsArray) {
            JsonObject command = commandElement.getAsJsonObject();
            if (!command.get("hidden").getAsBoolean()) {
                JsonArray commandAliases = command.getAsJsonArray("aliases");
                stringBuilder.append("**" + commandAliases.get(0).getAsString() + "**: " + command.get("description").getAsString() + "\n");
            }
        }
        sendBackMessage(event, MessageColor.OK, "Help", null, stringBuilder.toString());
    }
}
