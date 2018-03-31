package com.namelessmc.discord.cmds;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.canTalkCustom;
import com.namelessmc.discord.functions.fetchJson;
import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.Permission;
import net.dv8tion.jda.core.events.message.MessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;

public class supportCmd extends ListenerAdapter {
    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot() | event.getAuthor().isFake()) {
            return;
        }
        if (event.getMessage().getContentRaw().startsWith(Bot.BOT_PREFIX + "support")) {
            if (canTalkCustom.canTalk(event.getTextChannel())) {
                EmbedBuilder embedBuilder;
                JSONObject githubJson = fetchJson.fromUrl("https://api.github.com/repos/NamelessMC/BotConfiguration/commits/master");
                String commitHash = githubJson.getString("sha");
                if (!event.getMessage().getContentRaw().contains(" ")) {
                    embedBuilder = new EmbedBuilder().setTitle("Support").setColor(Bot.EMBED_COLOR)
                            .setDescription(getParameterMessage(commitHash));
                } else {
                    String[] args = event.getMessage().getContentRaw().replace(Bot.BOT_PREFIX + "support ", "").split(" ");
                    JSONObject supportJson = null;
                    if (args[0].equalsIgnoreCase("parameters")) {
                        embedBuilder = new EmbedBuilder().setTitle("Support").setColor(Bot.EMBED_COLOR)
                                .setDescription(getParameterMessage(commitHash));
                    } else {
                        try {
                            supportJson = fetchJson.fromUrl("https://raw.githubusercontent.com/NamelessMC/BotConfiguration/" + commitHash + "/support/" + URLEncoder.encode(args[0], "UTF-8") + ".json");
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        }
                        if (supportJson.getInt("responseCode") == 404) {
                            embedBuilder = new EmbedBuilder().setTitle("Support").setColor(Bot.EMBED_COLOR)
                                    .setDescription(getParameterMessage(commitHash));
                        } else {
                            String description = "";
                            for (Object line : supportJson.getJSONArray("body")) {
                                String stringLine = (String) line;
                                description = description + stringLine.replace("\\n", System.lineSeparator());
                            }
                            embedBuilder = new EmbedBuilder().setTitle("Support: " + supportJson.getString("title")).setColor(Bot.EMBED_COLOR)
                                    .setDescription(description).setFooter("Requested by " + event.getAuthor().getName() + "#" + event.getAuthor().getDiscriminator(), null);
                        }
                    }
                }
                event.getChannel().sendMessage(embedBuilder.build()).queue();
                if (event.getMessage().getContentRaw().contains(" ")) {
                    String[] splitMessage = event.getMessage().getContentRaw().split(" ");
                    if (Arrays.asList(splitMessage).get(Arrays.asList(splitMessage).size() - 1) == "-hide") {
                        if (event.getMember().hasPermission(event.getTextChannel(), Permission.MESSAGE_MANAGE)) {
                            event.getMessage().delete().queue();
                        }
                    }
                }
            }
        }
    }

    public static String getParameterMessage(String githubCommitHash) {
        JSONObject listParameters = fetchJson.fromUrl("https://raw.githubusercontent.com/NamelessMC/BotConfiguration/" + githubCommitHash + "/support/parameters.json");
        JSONArray parameters = listParameters.getJSONArray("parameters");
        String description = "**Available parameters:** ";
        for (Object parameter : parameters) {
            String stringParameter = (String) parameter;
            description = description + "``" + stringParameter + "``";
            if (stringParameter.equalsIgnoreCase(parameters.getString(parameters.length() - 1))) {
                description = description + ".";
            } else {
                description = description + ", ";
            }
        }
        return description;
    }
}
