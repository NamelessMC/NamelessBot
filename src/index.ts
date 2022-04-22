import { join } from "path";
import dotenv from "dotenv";
import Logger from "./handlers/Logger";
import chalk from "chalk";
import Bot from "./managers/Bot";
import { Intents, Options } from "discord.js";
import { readFileSync } from "fs";
import { Config } from "./types";

dotenv.config();

const config = JSON.parse(readFileSync("config.json", "utf8")) as Config;

// Setting up

const logger = new Logger();
logger.prefix = chalk.bold.redBright("MASTER");
const devmode = process.env.npm_lifecylce_event == "dev";

const logtype = devmode ? "warn" : "info";

logger.blank();
logger[logtype]("=================================");
logger[logtype](
    "Running bot in",
    devmode ? chalk.red("DEV") : chalk.green("PROD"),
    "mode"
);
logger[logtype]("=================================");
logger.blank();

const client = new Bot(
    {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
        partials: ["REACTION", "MESSAGE", "USER"],
        makeCache: Options.cacheWithLimits({
            MessageManager: 10,
            PresenceManager: 0,
        }),
        presence: {
            activities: [
                {
                    name: "/support | namelessmc.com",
                    type: "PLAYING",
                },
            ],
        },
    },
    config
);

client.events.load(join(__dirname, "events"));
client.commands.loadFromDirectory(join(__dirname, "./commands"));

if (client.devmode) {
    client.login(process.env.DEV_TOKEN ?? process.env.TOKEN);
} else {
    client.login(process.env.TOKEN);
}

export { client };
