package com.namelessmc.discord;

import com.namelessmc.discord.cmds.byeCmd;
import com.namelessmc.discord.cmds.helpCmd;
import com.namelessmc.discord.cmds.supportCmd;
import net.dv8tion.jda.core.AccountType;
import net.dv8tion.jda.core.JDA;
import net.dv8tion.jda.core.JDABuilder;
import net.dv8tion.jda.core.entities.Game;

import java.awt.*;
import java.io.*;
import java.util.Properties;

public class Bot {
    private static String BOT_TOKEN;
    public static String BOT_PREFIX = ">";
    public static Color EMBED_COLOR = new Color(0x0275D8);
    public static String[] ADMIN_USER_IDS = {"209769851651227648"};
    public static String[] ALLOWED_CHANNEL_PREFIXES = {"bot-", "nameless", "support", "test"};

    public static JDA jda;

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
            System.out.print("Bot Error > Config file did not exist, it has been created.\n");
        } else {
            // Load properties
            InputStream botPropertiesInput = new FileInputStream(botPropertiesFileName);
            prop.load(botPropertiesInput);
            if (prop.containsKey("token") && prop.getProperty("token").equalsIgnoreCase("PUT YOUR TOKEN HERE")) {
                System.out.print("Bot Error > The token isn't set.\n");
                System.exit(0);
            }
            // Set properties
            BOT_TOKEN = prop.getProperty("token");
            // Start bot
            System.out.print("Bot > Starting bot...\n");
            jda = new JDABuilder(AccountType.BOT).setToken(BOT_TOKEN)
                    .setGame(Game.playing(BOT_PREFIX + "help | namelessmc.com"))
                    .addEventListener(new helpCmd(), new byeCmd(), new supportCmd())
                    .buildAsync();
        }
    }
}
