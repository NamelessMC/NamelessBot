import { Message, ModalSubmitInteraction } from "discord.js";
import { client } from "..";
import { JsonEmbedResponse } from "../types";

export default class {
    private content: string;

    private responsesFile = `../../data/${client.config.repositoryName}/autoresponse.js`;

    constructor(content: string) {
        this.content = content;
    }

    public async run() {
        const response = await this.runChecks();
        if (!response) return;

        const embed = client.embeds.MakeResponse(response);
        return embed;
    }

    private async runChecks(): Promise<JsonEmbedResponse | undefined> {
        // Delete old cache in case it got changed
        delete require.cache[require.resolve(this.responsesFile)];
        const responses = require(this.responsesFile);

        for (const response of responses) {
            if (!this.keywordsMatch(response.keywords, this.content)) {
                continue;
            }

            return response.response;
        }
    }

    private async keywordsMatch(keywords: [string[]], text: string) {
        // If no keywords are given just return true
        if (keywords.length < 1) {
            return true;
        }

        // Check if any of the keywords match
        for (const keywordGroup of keywords) {
            const matchesEvery = keywordGroup.every((c) => {
                if (typeof c == "object" && (c as RegExp).test(text))
                    return true;
                else if (typeof c == "string" && text.includes(c)) return true;
                return false;
            });

            if (matchesEvery) {
                return true;
            }
        }
        return false;
    }
}
