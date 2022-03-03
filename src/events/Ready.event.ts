import chalk from "chalk";
import { join } from "path";
import { Event } from "../handlers/EventHandler";

export default class ReadyEvent extends Event<"ready"> {
    public event = "ready";
    public async run() {
        await this.client.commands.loadCommands();

        this.logger.info("Bot is now ready!");
        this.logger.info(
            `Bot logged in as ${chalk.green.bold(this.client.user.tag)}`
        );
    }
}
