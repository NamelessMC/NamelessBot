import chalk from "chalk";
import { execSync } from "child_process";
import {
    existsSync,
    lstatSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmdirSync,
    unlinkSync,
} from "fs";
import { join } from "path";
import Bot from "../managers/Bot";
import fetch from "node-fetch";

interface GHOptions {
    organisationName: string;
    repositoryName: string;
    branch: string;
    location: string;
}

export default class GHManager {
    private lastCommitHash: string = "";

    constructor(
        private readonly client: Bot,
        private readonly ghoptions: GHOptions
    ) {
        this.init();
    }

    private async init() {
        await this.checkRepoChange();
        this.client.logger.info(
            "Latest commit hash detected is",
            chalk.blue(this.lastCommitHash)
        );
    }

    public async cloneRepository() {
        const folderName = this.ghoptions.repositoryName.split("/").pop()!;

        // Delete already existing files
        this.deleteFolderRecursive(join(this.ghoptions.location, folderName));

        // Create folder if it doesn't exist
        mkdirSync(this.ghoptions.location, { recursive: true });

        // Clone repository with git
        execSync(
            `git clone https://github.com/${this.ghoptions.organisationName}/${this.ghoptions.repositoryName} --branch ${this.ghoptions.branch}`,
            {
                cwd: this.ghoptions.location,
            }
        );
        this.client.logger.info(
            `Cloned the github repository ${this.ghoptions.repositoryName}`
        );
    }

    public getFileFromRepo(file: string) {
        const filePath = join(
            this.ghoptions.location,
            this.ghoptions.repositoryName,
            file
        );
        const content = readFileSync(filePath, "utf8");
        return content;
    }

    private deleteFolderRecursive(path: string) {
        if (existsSync(path)) {
            readdirSync(path).forEach((file) => {
                const curPath = path + "/" + file;
                if (lstatSync(curPath).isDirectory()) {
                    this.deleteFolderRecursive(curPath);
                } else {
                    unlinkSync(curPath);
                }
            });
            rmdirSync(path);
        }
    }

    public async updateChecker() {
        setInterval(async () => {
            const changed = await this.checkRepoChange();
            if (!changed) {
                return;
            }

            this.client.logger.warn(
                "New commit hash detected",
                chalk.blue(this.lastCommitHash)
            );
            this.client.logger.warn("Updating the bot data");
            this.cloneRepository();
        }, 60000 * 5);
    }

    private async checkRepoChange() {
        const response = await fetch(
            `https://api.github.com/repos/${this.ghoptions.organisationName}/${this.ghoptions.repositoryName}/commits/${this.ghoptions.branch}`
        ).then((res) => res.json());
        const sha: string = (response as any).sha;
        if (!sha) {
            return false;
        }

        if (sha != this.lastCommitHash) {
            this.lastCommitHash = sha;
            return true;
        }

        return false;
    }
}
