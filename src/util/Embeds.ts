import { MessageEmbed } from "discord.js";
import Bot from "../managers/Bot";
import { JsonEmbedResponse } from "../types";

export default class Embeds {
    constructor(private readonly client: Bot) {}

    public base() {
        return new MessageEmbed().setColor("#0274D8").setFooter({
            text: `NamelessMC`,
            iconURL: this.client.user.displayAvatarURL(),
        });
    }

    public MakeResponse(data: JsonEmbedResponse) {
        const embed = this.base()
            .setTitle(data.title)
            .setDescription(data.body.join("\n"));

        if (data.footer) embed.setFooter({ text: data.footer });
        return embed;
    }
}
