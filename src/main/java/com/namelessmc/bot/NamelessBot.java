package com.namelessmc.bot;

import com.namelessmc.bot.commands.ByeCommand;
import com.namelessmc.bot.commands.HelpCommand;
import com.namelessmc.bot.listeners.JoinLeave;
import com.namelessmc.bot.listeners.MessageReceivedOCR;
import com.namelessmc.bot.listeners.MessageRecieved;
import com.namelessmc.bot.types.BotCommand;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.utils.ChunkingFilter;
import net.dv8tion.jda.api.utils.MemberCachePolicy;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.*;

public class NamelessBot {
    private static String BOT_TOKEN;
    // Command prefix
    public static String BOT_PREFIX = ">";
    // Github configuration branch
    public static String BRANCH = "master";
    // Welcome message channel
    public static String WELCOME_CHANNEL_NAME = "welcome";
    // Users allowed to use the eval, bye, etc. commands
    public static String[] ADMIN_USER_IDS = {"209769851651227648"};
    // Channels that the bot is allowed to accept commands in
    public static String[] ALLOWED_CHANNEL_PREFIXES = {"a", "bot-", "d", "logs", "nameless", "off-topic", "s", "support", "test-"};
    // The JDA instance
    public static JDA jda;
    // The commands that are registered
    public static Map<String, BotCommand> commands = new HashMap<>();

    public static void main(String[] arguments) throws Exception {
        System.out.print("\n");
        String botPropertiesFileName = "nameless-bot.properties";
        Properties prop = new Properties();
        // Create file if it doesn't exist.
        File botPropertiesFile = new File(botPropertiesFileName);
        if (!botPropertiesFile.exists()) {
            botPropertiesFile.createNewFile();
            PrintWriter botPropertiesFileWriter = new PrintWriter(botPropertiesFileName);
            botPropertiesFileWriter.print("# Nameless Bot Config\ntoken=PUT YOUR TOKEN HERE");
            botPropertiesFileWriter.close();
            System.out.println("Bot Error > Config file did not exist, it has been created.");
        } else {
            // Load properties
            InputStream botPropertiesInput = new FileInputStream(botPropertiesFileName);
            prop.load(botPropertiesInput);
            if (prop.containsKey("token") && prop.getProperty("token").equalsIgnoreCase("PUT YOUR TOKEN HERE")) {
                System.out.println("Bot Error > The token isn't set.");
                System.exit(0);
            }
            // Set properties
            BOT_TOKEN = prop.getProperty("token");
            // Start bot
            System.out.println("Bot > Starting bot...");
            jda = JDABuilder.createDefault(BOT_TOKEN).enableIntents(GatewayIntent.GUILD_MEMBERS)
                    .setMemberCachePolicy(MemberCachePolicy.ALL)
                    .setChunkingFilter(ChunkingFilter.ALL)
                    .setActivity(Activity.playing(BOT_PREFIX + "help | namelessmc.com"))
                    .addEventListeners(new JoinLeave(), new MessageRecieved(), new MessageReceivedOCR())
                    .build();
            // Register the commands
            registerCommand(new ByeCommand());
            registerCommand(new HelpCommand());
        }
    }

    public static void registerCommand(BotCommand botCommand) {
        for (String alias : botCommand.aliases) {
            commands.put(alias.toLowerCase(), botCommand);
        }
        System.out.println("Bot > Registered the command: " + botCommand.aliases[0]);
    }
}
