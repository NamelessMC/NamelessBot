import { Subcommand } from "@crystaldevelopment/command-handler/dist";
import { ApplicationCommandOptionType } from "discord-api-types";
import {
    ApplicationCommandOptionData,
    CommandInteraction,
    GuildMember,
    NewsChannel,
    TextChannel,
} from "discord.js";
import ReactionRole from "../../models/ReactionRole";

export default class extends Subcommand {
    public name = "add";
    public description = "Add a reaction role";
    public options: ApplicationCommandOptionData[] = [
        {
            type: ApplicationCommandOptionType.String as number,
            name: "msglink",
            description: "The message link to add the reaction role to",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String as number,
            name: "emoji",
            description: "The emoji this reaction role works with",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Role as number,
            name: "role",
            description: "The role to give to the user",
            required: true,
        },
    ];

    public onStart(): void {
        null;
    }

    public onLoad(): void {
        null;
    }

    public async run(interaction: CommandInteraction): Promise<any> {
        if (!interaction.guild || !(interaction.member instanceof GuildMember))
            return; // Its definitly defined

        const messageLink = interaction.options.getString("msglink");
        const emoji = interaction.options.getString("emoji");
        const role = interaction.options.getRole("role");

        if (!messageLink || !emoji || !role) {
            return;
        }

        /**
         * Parsing message link to get the message we want to add the reaction role to
         */
        const regex =
            /<?https:\/\/([canary.]?)+discord.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})>?/gm;
        const matches = regex.exec(messageLink);
        if (!matches) {
            return;
        }

        const channelId = matches[3];
        const messageId = matches[4];

        const channel = await interaction.guild.channels
            .fetch(channelId)
            .catch();
        if (
            !channel
            || (!(channel instanceof TextChannel)
                && !(channel instanceof NewsChannel))
        ) {
            interaction.reply("Channel is not a text channel");
            return;
        }

        const message = await channel.messages.fetch(messageId);
        if (!message) {
            interaction.reply("Message not found");
            return;
        }

        const exists = await ReactionRole.findOne({
            where: { messageId: message.id, emoji: emoji },
        });
        if (exists) {
            interaction.reply("Reaction role already exists");
            return;
        }

        const dbentry = new ReactionRole({
            messageId,
            emoji: emoji,
            roleId: role.id,
        });

        await dbentry.save();
        await message.react(emoji);

        interaction.reply("Reaction role added");
    }
}
