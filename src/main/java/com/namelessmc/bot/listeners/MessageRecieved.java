package com.namelessmc.bot.listeners;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.namelessmc.bot.NamelessBot;
import com.namelessmc.bot.commands.types.ArgDirCommandType;
import com.namelessmc.bot.commands.types.BasicCommandType;
import com.namelessmc.bot.commands.types.CodeCommandType;
import com.namelessmc.bot.utils.FetchJson;
import com.namelessmc.bot.utils.OCRProcessor;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;

public class MessageRecieved extends ListenerAdapter {

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (!event.getMessage().getContentRaw().startsWith(NamelessBot.BOT_PREFIX)) {
            return;
        }
        if (!event.getChannelType().isGuild()) {
            return;
        }
        String commandUsed = event.getMessage().getContentRaw().toLowerCase().substring(NamelessBot.BOT_PREFIX.length());
        String[] args = {};
        if (commandUsed.contains(" ")) {
            commandUsed = commandUsed.split(" ")[0];
            args = event.getMessage().getContentRaw().split(" ");
            args = Arrays.copyOfRange(args, 1, args.length);
        }
        if (NamelessBot.commands.containsKey(commandUsed)) {
            NamelessBot.commands.get(commandUsed).execute(event, commandUsed, args);
        } else {
            JsonObject githubJson = FetchJson.fromUrl("https://api.github.com/repos/Supercrafter100/BotConfiguration/commits/" + NamelessBot.BRANCH);
            String commitHash = githubJson.get("sha").getAsString();

            JsonObject commands = FetchJson.fromUrl("https://raw.githubusercontent.com/Supercrafter100/BotConfiguration/" + commitHash + "/commands.json");
            JsonArray commandsArray = commands.get("commands").getAsJsonArray();
            for (JsonElement commandElement : commandsArray) {
                JsonObject command = commandElement.getAsJsonObject();
                JsonArray commandAliases = command.getAsJsonArray("aliases");
                for (JsonElement aliasElement : commandAliases) {
                    String alias = aliasElement.getAsString();
                    if (alias.toLowerCase().equals(commandUsed)) {
                        if (command.get("type").getAsString().equalsIgnoreCase("basic")) {
                            new BasicCommandType().execute(event, commitHash, commandAliases.get(0).getAsString(), args);
                            return;
                        } else if (command.get("type").getAsString().equalsIgnoreCase("argdir")) {
                            new ArgDirCommandType().execute(event, commitHash, commandAliases.get(0).getAsString(), args);
                            return;
                        } else if (command.get("type").getAsString().equalsIgnoreCase("code")) {
                            new CodeCommandType().execute(event, commitHash, commandAliases.get(0).getAsString(), args);
                        }
                    }
                }
            }
        }
    }
}
