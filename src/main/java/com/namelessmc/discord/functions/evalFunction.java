package com.namelessmc.discord.functions;

import com.namelessmc.discord.Bot;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.Arrays;

public class evalFunction {
    static ScriptEngine se = new ScriptEngineManager().getEngineByName("groovy");

    public static void executeFunction(String[] args, MessageReceivedEvent event) {
        se.put("args", args);
        se.put("author", event.getAuthor());
        se.put("channel", event.getChannel());
        se.put("event", event);
        se.put("guild", event.getGuild());
        se.put("jda", event.getJDA());
        se.put("member", event.getMember());
        se.put("message", event.getMessage());
        se.put("user", event.getAuthor());

        String footerText = messageAddons.footerMessage(event);
        Boolean isGoingToHide = messageAddons.isGoingToHide(event);

        if (args.length == 1) {
            event.getTextChannel().sendMessage(new EmbedBuilder()
                    .setTitle("Eval")
                    .setColor(Bot.EMBED_COLOR)
                    .setDescription("Defined variables: ``args``, ``author``, ``channel``, ``event``, ``guild``, ``jda``, ``member``, ``message``, ``user``")
                    .setFooter(footerText, null)
                    .build()
            ).queue();
            return;
        }
        args = Arrays.copyOfRange(args, 1, args.length);
        String eval = String.join(" ", args);
        Object response;
        boolean failed = false;

        try {
            response = se.eval(eval);
        } catch (ScriptException ex) {
            failed = true;
            response = ex.getMessage();
        }

        String stringEval = messageAddons.sanitizeMessage(eval, true);
        String stringResponse = messageAddons.sanitizeMessage(response.toString(), true);

        event.getTextChannel().sendMessage(new EmbedBuilder()
                .setTitle("Eval")
                .setColor(failed ? Bot.EMBED_COLOR_RED : Bot.EMBED_COLOR_GREEN)
                .setDescription("Input: ```" + stringEval + "```" + System.lineSeparator() + "Response: ```" + stringResponse + "```")
                .setFooter(footerText, null)
                .build()
        ).queue();
        //"Evaluation: ```" + eval + "``` \n\nResponse: ```" + response + "```"
    }
}
