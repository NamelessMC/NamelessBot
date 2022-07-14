import chalk from "chalk";
import Discord from "discord.js";
import Logger from "../handlers/Logger";
import EventHandler from "../handlers/EventHandler";
import { CommandHandler } from "@crystaldevelopment/command-handler";
import Embeds from "../util/Embeds";
import { Config } from "../types";
import GHManager from "../handlers/GHManager";
import { join } from "path/posix";
import { Sequelize } from "sequelize";

export default class Bot extends Discord.Client<true> {
    //      Handlers

    public readonly commands = new CommandHandler(this, {
        ...(process.env.GUILDID && { guildId: process.env.GUILDID }),
        createCommands: true,
        updateCommands: true,
        deleteCommands: true,
    });
    public readonly events = new EventHandler(this);

    //      Util

    public readonly logger = new Logger();
    public readonly embeds = new Embeds(this);

    public github: GHManager;
    public sequelize: Sequelize;

    //      Misc

    public readonly extension: string;
    public readonly devmode: boolean;

    public config: Config;

    constructor(options: Discord.ClientOptions, config: Config) {
        super(options);

        this.logger.prefix = chalk.green("BOT");
        this.devmode = process.env.npm_lifecycle_event == "dev";
        this.extension = this.devmode ? ".ts" : ".js";
        this.config = config;

        this.github = new GHManager(this, {
            organisationName: this.config.organizationName,
            repositoryName: this.config.repositoryName,
            branch: this.config.branch,
            location: join(__dirname, "../../data"),
        });
        this.sequelize = new Sequelize({
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            logging: false,
        });

        this.logger.info("Starting bot...");
        this.start();
    }

    private async start() {
        await this.events.start();
        await this.github.cloneRepository();
        this.github.updateChecker();
        this.sequelize.sync();
    }
}
