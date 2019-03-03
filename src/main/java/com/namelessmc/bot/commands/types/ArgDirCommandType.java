package com.namelessmc.bot.commands.types;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.namelessmc.bot.types.BotCommandType;
import com.namelessmc.bot.types.MessageColor;
import com.namelessmc.bot.utils.FetchJson;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Iterator;

public class ArgDirCommandType extends BotCommandType {

    @Override
    public void execute(MessageReceivedEvent event, String latestCommit, String command, String[] args) {
        try {
            if (args.length != 1) {
                JsonObject json = FetchJson.fromUrl("https://raw.githubusercontent.com/NamelessMC/BotConfiguration/" + latestCommit + "/commands/" + URLEncoder.encode(command, "UTF-8") + ".json");
                StringBuilder stringBuilder = new StringBuilder();
                Iterator<JsonElement> iterator = json.get("parameters").getAsJsonArray().iterator();
                if (iterator.hasNext()) {
                    stringBuilder.append("``" + iterator.next().getAsString() + "``");
                }
                while (iterator.hasNext()) {
                    stringBuilder.append(", ``" + iterator.next().getAsString() + "``");
                }
                sendBackMessage(event, MessageColor.OK, json.get("title").getAsString(), json.get("footer").getAsString(), "Available parameters: " + stringBuilder.toString());
            } else {
                JsonObject json = FetchJson.fromUrl("https://raw.githubusercontent.com/NamelessMC/BotConfiguration/" + latestCommit + "/commands/" + URLEncoder.encode(command, "UTF-8") + "/" + URLEncoder.encode(args[0], "UTF-8") + ".json");
                if (json.get("responseCode").getAsInt() == 404) {
                    sendBackMessage(event, MessageColor.ERROR, "Error", null, "The parameter you requested doesn't exist.");
                } else {
                    StringBuilder stringBuilder = new StringBuilder();
                    for (JsonElement lineElement : json.get("body").getAsJsonArray()) {
                        String line = lineElement.getAsString();
                        line = line.replace("\\n", System.lineSeparator());
                        stringBuilder.append(line);
                    }
                    sendBackMessage(event, MessageColor.OK, json.get("title").getAsString(), json.get("footer").getAsString(), stringBuilder.toString());
                }
            }
        } catch (UnsupportedEncodingException e) {
            sendBackMessage(event, MessageColor.ERROR, "Error", null, "There was an error processing the command.");
            //e.printStackTrace();
        }
    }
}
