package com.namelessmc.discord.events;

import com.namelessmc.discord.Bot;
import com.namelessmc.discord.functions.canTalkCustom;

import net.dv8tion.jda.core.EmbedBuilder;
import net.dv8tion.jda.core.entities.TextChannel;
import net.dv8tion.jda.core.entities.User;
import net.dv8tion.jda.core.events.message.guild.GuildMessageDeleteEvent;
import net.dv8tion.jda.core.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.core.hooks.ListenerAdapter;

public class logsEvent extends ListenerAdapter {
	
	@Override
	public void onGuildMessageReceived(GuildMessageReceivedEvent event) {
    	
        if (!event.getAuthor().isBot() && !event.getAuthor().isBot()) {
        	boolean watchedChannel = false;
            User eventUser = event.getAuthor();
            String cleanUsername = eventUser.getName().replace("`", "\\`");
            
            for (String channel : Bot.WATCH_CHANNELS) {
                if (event.getChannel().getName().equalsIgnoreCase(channel)) watchedChannel = true;
            }
            
            if (event.getGuild().getTextChannelsByName(Bot.LOGS_MESSAGE_CHANNEL, true).size() > 0 && watchedChannel) {
                TextChannel logsChannel = event.getGuild().getTextChannelsByName(Bot.LOGS_MESSAGE_CHANNEL, true).get(0);
                if (canTalkCustom.canTalk(logsChannel, true)) {
                    EmbedBuilder embedBuilder = new EmbedBuilder()
                    		.setTitle("Message Sent")
                    		.setColor(Bot.EMBED_COLOR_GREEN)
                            .setDescription(event.getMessage().getContentDisplay())
                            .setFooter("#" + event.getChannel().getName(), null)
                            .setAuthor(cleanUsername + "#" + eventUser.getDiscriminator(), null, eventUser.getAvatarUrl());
                    logsChannel.sendMessage(embedBuilder.build()).queue();
                }
            }
        }
    }

	@Override
	public void onGuildMessageDelete(GuildMessageDeleteEvent event) {
		boolean watchedChannel = false;
        for (String channel : Bot.WATCH_CHANNELS) {
            if (event.getChannel().getName().equalsIgnoreCase(channel)) watchedChannel = true;
        }
		
		if (event.getGuild().getTextChannelsByName(Bot.LOGS_MESSAGE_CHANNEL, true).size() > 0 && watchedChannel) {
			TextChannel logsChannel = event.getGuild().getTextChannelsByName(Bot.LOGS_MESSAGE_CHANNEL, true).get(0);
			if (canTalkCustom.canTalk(logsChannel, true)) {
				EmbedBuilder embedBuilder = new EmbedBuilder().setTitle("Message Deleted").setColor(Bot.EMBED_COLOR_RED).setFooter("#" + event.getChannel().getName(), null);
				logsChannel.sendMessage(embedBuilder.build()).queue();
			}
		}
	}
    
}
