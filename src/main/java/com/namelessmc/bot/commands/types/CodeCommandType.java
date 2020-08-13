package com.namelessmc.bot.commands.types;

import com.google.gson.JsonObject;
import com.namelessmc.bot.types.BotCommandType;
import com.namelessmc.bot.types.MessageColor;
import com.namelessmc.bot.utils.Base58;
import com.namelessmc.bot.utils.EvalUtil;
import com.namelessmc.bot.utils.FetchJson;
import com.namelessmc.bot.utils.MessageUtils;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;

import java.net.URLEncoder;

public class CodeCommandType extends BotCommandType {

    @Override
    public void execute(MessageReceivedEvent event, String latestCommit, String command, String[] args) {
        JsonObject evalJson = new JsonObject();
        try {
            JsonObject json = FetchJson.fromUrl("https://raw.githubusercontent.com/NamelessMC/BotConfiguration/" + latestCommit + "/commands/" + URLEncoder.encode(command, "UTF-8") + ".json");
            StringBuilder stringBuilder = new StringBuilder();
            evalJson = EvalUtil.evaluate(new String(Base58.decode(json.get("code").getAsString())), event);
        } catch (Exception e) {
            if (evalJson.has("failed")) {
                if (evalJson.get("failed").getAsBoolean()) {
                    sendBackMessage(event, MessageColor.ERROR, "Error", null, "There was an error processing the command.\n```" + MessageUtils.sanitize(evalJson.get("response").getAsString()) + "```");
                }
            }
            //e.printStackTrace();
        }
    }
}
