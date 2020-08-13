package com.namelessmc.bot.utils;

import com.google.gson.JsonObject;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.Arrays;

public class EvalUtil {

    private static ScriptEngine se = new ScriptEngineManager().getEngineByName("groovy");

    public static JsonObject evaluate(String code, MessageReceivedEvent event) {
        se.put("author", event.getAuthor());
        se.put("channel", event.getChannel());
        se.put("event", event);
        se.put("guild", event.getGuild());
        se.put("jda", event.getJDA());
        se.put("message", event.getMessage());
        se.put("member", event.getMember());
        se.put("user", event.getAuthor());

        Object response;
        boolean failed = false;

        try {
            response = se.eval(code);
        } catch (ScriptException ex) {
            failed = true;
            response = ex.getMessage();
        }
        JsonObject finalJson = new JsonObject();
        finalJson.addProperty("failed", failed);
        finalJson.addProperty("response", response.toString());
        return finalJson;
    }
}
