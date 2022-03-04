import { Message } from "discord.js";
import { Event } from "../handlers/EventHandler";
// @ts-ignore
import Tesseract from "node-tesseract-ocr";
import fetch from "node-fetch";
import { client } from "../index";

const tesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }

export default class ReadyEvent extends Event<"messageCreate"> {
    public event = "messageCreate";
    public async run(msg: Message) {
        if (
            !msg.guild
            || msg.guild.id !== client.config.guildID
            || client.config.exclusions.includes(msg.channel.id)
        )
            return;

        //
        //  Extract all neccesary data to perform automatic response matching
        //

        let text = msg.content;

        // Image attachments
        for (const attachment of msg.attachments.toJSON()) {
            if (!attachment.contentType?.includes("image")) {
                continue;
            }

            text += " " + (await Tesseract.recognize(attachment.url, tesseractConfig));
        }

        // Text attachments
        for (const attachment of msg.attachments.toJSON()) {
            if (!attachment.contentType?.includes("text")) {
                continue;
            }

            const rawContent = await fetch(attachment.url.split("?")[0]).then(
                (res) => res.text()
            );
            text += " " + rawContent;
        }

        // Check for any urls
        const urlRegex =
            /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        const urls = msg.content.match(urlRegex) ?? [];

        for (const url of urls) {
            if (!isValidImageURL(url)) {
                continue;
            }

            text += " " + (await Tesseract.recognize(url, tesseractConfig));
        }

        // Replace artifacts that occur with OCR etc
        text = text.replace(/\n/g, " ");
        text = text.replace(/\`/g, "'");
        text = text.replace(/\‘/g, "'");

        // Run both debug link checks and regular checks
        const textCheckResult = await runTextChecks(text);
        const debugLinkCheckResult = await runDebugChecks(text);

        if (textCheckResult) {
            const sent = await msg.channel.send({
                embeds: [client.embeds.MakeResponse(textCheckResult)],
            });
            await sent.react("🗑️");
        }
        if (debugLinkCheckResult) {
            const sent = await msg.channel.send({
                embeds: [client.embeds.MakeResponse(debugLinkCheckResult)],
            });
            await sent.react("🗑️");
        }
    }
}

const runTextChecks = async (text: string) => {
    delete require.cache[
        require.resolve(
            `../../data/${client.config.repositoryName}/autoresponse.js`
        )
    ];
    const responses = require(`../../data/${client.config.repositoryName}/autoresponse.js`);
    for (const response of responses) {
        if (!keywordsMatch(response.keywords, text)) {
            continue;
        }

        return response.response;
    }
};

const runDebugChecks = async (text: string) => {
    const regex = /https:\/\/debug\.namelessmc\.com\/([^\s]*)/gim;
    const matches = regex.exec(text);
    const debugID = matches ? matches[1] : undefined;
    if (!debugID) {
        return;
    }

    const debugContent = await getDebugContents(debugID);
    if (!debugContent) {
        return;
    }

    delete require.cache[
        require.resolve(
            `../../data/${client.config.repositoryName}/debug_link_responses.js`
        )
    ];
    const responses = require(`../../data/${client.config.repositoryName}/debug_link_responses.js`);
    for (const response of responses) {
        if (!keywordsMatch(response.keywords, text)) {
            continue;
        }

        const result = await response.execute(debugContent);
        return result;
    }
};

const isValidImageURL = (text: string) => {
    const cleanedURL = text.split("?")[0]; // Removes any parameters because nobody likes those
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    for (const ext of allowedExtensions) {
        if (cleanedURL.endsWith(ext)) {
            return true;
        }
    }
    return false;
};

const keywordsMatch = (keywords: [string[]], text: string) => {
    // Keywords look a bit like [ ["keyword1", "keyword2"], ["keyword3"] ] | Each keyword is an array of strings and each array in the array is optional
    // but the words in those arrays are required

    // If no keywords are given just return true
    if (keywords.length < 1) {
        return true;
    }

    // Check if any of the keywords match
    for (const keywordGroup of keywords) {
        if (
            keywordGroup.every((c) =>
                text.toLowerCase().includes(c.toLowerCase())
            )
        ) {
            return true;
        }
    }
    return false;
};

const getDebugContents = async (debugID: string) => {
    const paste = await fetch(
        `https://bytebin.rkslot.nl/${encodeURIComponent(debugID)}`
    )
        .then((res) => res.json())
        .catch(() => undefined);
    if (paste) {
        return paste;
    }

    return undefined;
};
