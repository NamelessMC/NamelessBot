import { client } from "..";
import { AutoResponse, JsonEmbedResponse } from "../types";

export default class {
    private content: string;
    public responsesFile = `../../data/${client.config.repositoryName}/autoresponse.js`;

    private ACCURACCY = 0.7;

    public result: JsonEmbedResponse | undefined;

    constructor(content: string) {
        this.content = content;
    }

    public getResponse() {
        if (!this.result) {
            return;
        }
        return client.embeds.MakeResponse(this.result);
    }

    public async run() {
        this.result = await this.runChecks();
        return this.result;
    }

    private async runChecks(): Promise<JsonEmbedResponse | undefined> {
        // Delete old cache in case it got changed. Its not that important
        delete require.cache[require.resolve(this.responsesFile)];
        const responses = require(this.responsesFile);

        for (const response of responses) {
            if (
                !this.keywordsMatch(
                    response.keywords,
                    this.content.toLowerCase()
                )
            ) {
                continue;
            }

            return response.response;
        }

        // Check if ML can help us :)
        const { category, value } = await client.MachineLearning.predict(this.content);
        if (value >= this.ACCURACCY) {
            const embed = responses.find((r: AutoResponse) => r.id === category);
            return embed.response
        }
    }

    private keywordsMatch(keywords: [string[]], text: string) {
        // If no keywords are given just return true
        if (keywords.length < 1) {
            return true;
        }

        // Check if any of the keywords match
        for (const keywordGroup of keywords) {
            const matchesEvery = keywordGroup.every((c) => {
                if (typeof c == "object" && (c as RegExp).test(text))
                    return true;
                else if (typeof c == "string" && text.includes(c.toLowerCase()))
                    return true;
                return false;
            });

            if (matchesEvery) {
                return true;
            }
        }
        return false;
    }
}
