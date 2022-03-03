import { MessageReaction, User } from "discord.js";
import { Event } from "../handlers/EventHandler";

export default class InteractionCreate extends Event<"messageReactionAdd"> {
    public event = "messageReactionAdd";

    public async run(reaction: MessageReaction, user: User) {
        if (reaction.partial) reaction = await reaction.fetch();
        if (user.partial) user = await user.fetch();

        if (
            user.id !== this.client.user.id &&
            reaction.emoji.name == "🗑️" &&
            reaction.message.author?.id == this.client.user.id &&
            reaction.users.cache.has(this.client.user.id) &&
            reaction.message.guild?.members.cache
                .get(user.id)
                ?.permissions.has("MANAGE_MESSAGES")
        ) {
            reaction.message.delete();
        }
    }
}
