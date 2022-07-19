import { GuildChannel, Message } from "discord.js";
import { Event } from "../handlers/EventHandler";
// @ts-ignore
import Tesseract from "node-tesseract-ocr";
import fetch from "node-fetch";
import { client } from "../index";
import { BinLink } from "../types";
import AutoResponseManager from "../managers/AutoResponseManager";
import StatisticsManager from "../managers/StatisticsManager";

const tesseractConfig = {
    lang: "eng",
    oem: 2,
    psm: 3,
};

export default class ReadyEvent extends Event<"messageCreate"> {
    public event = "messageCreate";
    public async run(msg: Message) {
        if (
            !msg.guild
            || msg.guild.id !== client.config.guildID
            || client.config.exclusions.includes(msg.channel.id)
            || msg.author.bot
            || msg.author.system
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

            text +=
                " "
                + (await Tesseract.recognize(attachment.url, tesseractConfig));
        }

        // Text attachments
        for (const attachment of msg.attachments.toJSON()) {
            if (!attachment.contentType?.includes("text")) {
                continue;
            }

            const rawContent = await fetch(attachment.url.split("?")[0]).then(
                (res) => res.text()
            );

            const content = checkForFatalLog(rawContent) ?? rawContent;
            text += " " + content;
        }

        // Paste links
        const bins = JSON.parse(
            client.github.getFileFromRepo("bin_links.json")
        ) as BinLink[];
        for (const bin of bins) {
            const regex = RegexParser(bin.regex);
            const matches = regex.exec(msg.content);
            if (!matches) {
                continue;
            }

            const link = await fetch(
                bin.getLink.replace("{code}", matches[1])
            ).then((res) => res.text());

            text += " " + link;
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

        // Check if it contains sensitive content
        const sensitive = containsSensitiveInformation(text);
        if (sensitive) {
            msg.deletable && (await msg.delete());
            msg.channel.send({ embeds: [sensitive] });
            return;
        }

        // Run both debug link checks and regular checks
        const TextAutoResponse = new AutoResponseManager(text);
        await TextAutoResponse.run();
        const textCheckResult = TextAutoResponse.getResponse();

        const debugLinkCheckResult = await runDebugChecks(text);

        if (textCheckResult) {
            StatisticsManager.SaveResponse(
                TextAutoResponse.result!,
                msg.channel as GuildChannel
            ); // Statistics
            await msg.reply({
                embeds: [textCheckResult],
            });
        }
        if (debugLinkCheckResult) {
            await msg.reply({
                embeds: [client.embeds.MakeResponse(debugLinkCheckResult)],
            });
        }
    }
}

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
        const result = await response.execute(debugContent, text);
        if (
            typeof result == "undefined"
            || (typeof result === "boolean" && !result)
        ) {
            continue; // If we return nothing or false then we don't want to respond
        }

        return result;
    }
};

/**
 * Check if a provided url is a valid image url
 * @param text The url to check
 * @returns if the url is a valid image url
 */
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

/**
 * Get the contents of a fatal log file that matter. Not ancient ones
 * @param content The content to extract the fatal log from
 * @returns The relevant content
 */
const checkForFatalLog = (content: string) => {
    const regex = /\[(\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2})\] .+/gi;
    if (!regex.exec(content.split("\n")[0]) == null) {
        return;
    }

    const allowed = [];

    const lines = content.split("\n");
    for (const line of lines) {
        const parsed = regex.exec(line);
        if (parsed == null) continue; // No match

        const date = parsed[1];
        const time = parsed[2];

        const dateTime = new Date(`${date} ${time}`);
        const now = new Date();

        if (now.getTime() - dateTime.getTime() > 1000 * 60 * 60 * 2) {
            continue; // Ignore if older than 2 hours
        }

        allowed.push(line);
    }

    return allowed.join(" ");
};

/**
 * Get the contents of the debug log from a specicif debug ID
 * @param debugID The debug ID to get the contents of
 * @returns The contents of the debug log associated with the ID
 */
const getDebugContents = async (
    debugID: string
): Promise<string | undefined> => {
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

/**
 * Convert a string form of regex to a regex object
 * @param input The regex in string form
 * @returns RegExp object
 */
const RegexParser = (input: string): RegExp => {
    // Validate input
    if (typeof input !== "string") {
        throw new Error("Invalid input. Input must be a string");
    }

    // Parse input
    const m = input.match(/(\/?)(.+)\1([a-z]*)/i);
    if (m == null) {
        throw new Error("Invalid input. Input must be in the format /(.*)/i");
    }

    // Invalid flags
    if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
        return RegExp(input);
    }

    // Create the regular expression
    return new RegExp(m[2], m[3]);
};

/**
 * Check if the message contains sensitive information and return an embed if so
 * @param text The text to check in
 */
const containsSensitiveInformation = (text: string) => {
    const dbCredentialsKeywords = [
        "'db'",
        "'host'",
        "'password'",
        "'username'",
    ];

    if (
        dbCredentialsKeywords.every((keyword) =>
            text.toLowerCase().includes(keyword)
        )
    ) {
        const matches = new RegExp("'password' => '(.*?)'").exec(text);
        if (matches && matches[1] && matches[1].length > 0) {
            return client.embeds
                .base()
                .setDescription(
                    "Your message has been deleted because it contains your database password. Please remove it and keep it as an empty string (`''`) and then send it again."
                );
        }
    }

    return false;
};
