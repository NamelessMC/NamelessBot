import { MessageReaction, User } from "discord.js";
import { Event } from "../handlers/EventHandler";
import ReactionRole from "../models/ReactionRole";

export default class InteractionCreate extends Event<"messageReactionAdd"> {
    public event = "messageReactionAdd";

    public async run(reaction: MessageReaction, user: User) {
        if (reaction.partial) reaction = await reaction.fetch();
        if (user.partial) user = await user.fetch();

        /**
         * Reaction role logic
         */
        const reactionRole = await ReactionRole.findOne({
            where: {
                messageId: reaction.message.id,
                emoji:
                    reaction.emoji.id != null
                        ? reaction.emoji.id
                        : reaction.emoji.name,
            },
        });

        if (reactionRole) {
            // Get role
            const role = await reaction.message.guild?.roles.fetch(
                reactionRole.roleId
            );
            if (!role) {
                this.client.logger.error(
                    "Could not find role with id " + reactionRole.roleId
                );
                return;
            }

            // Check if member has role
            const member = reaction.message.guild?.members.cache.get(user.id);
            if (!member) {
                this.client.logger.warn(
                    "Could not find member with id " + user.id
                );
                return;
            }

            if (!member?.roles.cache.has(role.id)) await member.roles.add(role);
        }
    }
}
