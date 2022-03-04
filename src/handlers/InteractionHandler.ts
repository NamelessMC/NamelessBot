import { Collection, Snowflake } from "discord.js";
import Bot from "../managers/Bot";
import fs from "fs";
import PATH from "path";
import chalk from "chalk";

export default abstract class InteractionHandler<CollectType extends Object> {
    public abstract readonly extension: string;
    public readonly cache = new Collection<Snowflake, CollectType>();
    public readonly client: Bot;

    constructor(client: Bot) {
        this.client = client;
    }

    //	Gets called when the client is ready.

    private cached: string[] = [];
    private started = false;
    protected requireReady = true;
    public async start() {
        if (this.started)
            return this.logger.error(
                `Tried to start ${this.constructor.name}, but it already started`
            );
        if (this.requireReady && !this.client.isReady())
            return this.logger.error(
                `Tried to start ${this.constructor.name}, but client is not ready yet.`
            );
        this.started = true;

        await this.onStart();

        while (this.cached.length > 0) {
            const path = this.cached.shift()!;
            await this.onLoadFile(path);
        }

        await this.onStarted();
        this.logger.info(chalk.green(this.constructor.name), "Is now ready");
    }

    //	Events

    protected abstract onStart(): Promise<void>;
    protected async onStarted(): Promise<void> {}
    protected abstract onLoadFile(path: string): any;

    //	Handlers

    public abstract handle(...args: any[]): Promise<any>;

    public loadFile(path: string) {
        if (!this.started) return this.cached.push(path);
        this.onLoadFile(path);
    }

    public load(path: string) {
        const files = fs.readdirSync(path);
        let base = path;

        files.forEach((file) => {
            let path = PATH.join(base, file);

            if (fs.lstatSync(path).isDirectory()) {
                this.load(path);
            } else if (
                file.endsWith(`.${this.extension}${this.client.extension}`)
            ) {
                this.loadFile(path);
            }
        });
    }

    //	Logger shortcut

    public get logger() {
        return this.client.logger;
    }
}

export class InteractionRejected extends Error {
    public static is(error: any): error is InteractionRejected {
        return error instanceof InteractionRejected;
    }

    public constructor(msg: string) {
        super(msg);
        this.name = this.constructor.name;
    }
}
