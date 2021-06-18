package com.namelessmc.bot.listeners;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.namelessmc.bot.NamelessBot;
import com.namelessmc.bot.types.MessageColor;
import com.namelessmc.bot.utils.FetchJson;
import com.namelessmc.bot.utils.MessageUtils;
import com.namelessmc.bot.utils.OCRProcessor;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class MessageReceivedOCR extends ListenerAdapter {

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot() || event.getAuthor().isFake()) {
            return;
        }

        // Run check on the text the user sends, if there is no match we can check images
        String messageToCheck = event.getMessage().getContentRaw();
        JsonObject matchedResponse = matchResponse(messageToCheck);
        if (matchedResponse != null) {

            String title = matchedResponse.get("title").getAsString();
            String footer = matchedResponse.get("footer").getAsString();
            String body = stringArrayToString(matchedResponse.get("body").getAsJsonArray());

            MessageUtils.sendBackMessage(event, MessageColor.OK, title, footer, body);
            return;
        }

        // OCR

        // Check if message contains image attachments
        if (event.getMessage().getAttachments().stream().anyMatch(x -> x.isImage())) {

            // React with a set of eyes if it does
            event.getMessage().addReaction("\uD83D\uDC40").queue();

            // Loop through all attachments
            event.getMessage().getAttachments().stream().forEach(x -> {
                if (!x.isImage()) return;
                x.retrieveInputStream().thenAccept(y -> {
                    try {

                        // Creating buffered image to do OCR on with tesseract
                        BufferedImage imgBuff = ImageIO.read(y);
                        String textOut = OCRProcessor.extractTextFromImage(imgBuff);

                        JsonObject matchResponse = matchResponse(textOut);
                        if (matchResponse != null) {
                            String title = matchResponse.get("title").getAsString();
                            String footer = matchResponse.get("footer").getAsString();
                            String body = stringArrayToString(matchResponse.get("body").getAsJsonArray());

                            MessageUtils.sendBackMessage(event, MessageColor.OK, title, footer, body);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            });
        }
    }

    private String stringArrayToString(JsonArray arr) {
        StringBuilder stringBuilder = new StringBuilder();
        for (JsonElement lineElement : arr) {
            String line = lineElement.getAsString();
            line = line.replace("\\n", System.lineSeparator());
            stringBuilder.append(line);
        }

        return stringBuilder.toString();
    }

    private boolean keywordsMatch(String text, JsonArray keywords) {
        for (int i = 0; i < keywords.size(); i++) {
            if (!text.toLowerCase().contains(keywords.get(i).getAsString().toLowerCase())) {
                return false;
            }
        }
        return true;
    }

    private JsonObject matchResponse(String textToMatch) {

        // Get all the responses the bot can have
        JsonObject githubJson =  FetchJson.fromUrl("https://api.github.com/repos/namelessmc/BotConfiguration/commits/" + NamelessBot.BRANCH, false);
        String commitHash = githubJson.get("sha").getAsString();
        JsonArray responses = FetchJson.asArrayFromUrl("https://raw.githubusercontent.com/namelessmc/BotConfiguration/" + commitHash + "/autoresponse.json", false);

        // Loop through each response
        for (int i = 0; i < responses.size(); i++) {
            JsonObject response = responses.get(i).getAsJsonObject();
            JsonArray keywords = response.get("keywords").getAsJsonArray();
            if (!keywordsMatch(textToMatch, keywords)) continue;

            return response.get("response").getAsJsonObject();
        }

        return null;
    }
}

