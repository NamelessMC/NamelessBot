import { client, config } from "../index.js";
import Tesseract from "node-tesseract-ocr";
import EmbedUtils from "../constants/EmbedUtil.js";
import fetch from "node-fetch";
import { MessageEmbed, TextChannel } from "discord.js";

const tesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 3,
};

/**
 * Used for automatic responses
 */
client.on("messageCreate", async (msg) => {
    // Create a worker instead of just recognizing to prevent a child process from eating our ram in the background when we are not using it
    if (!msg.guild) return;
    if (msg.guild.id !== config.guildID) return;
    if (config.channelExclusions.autoresponses.includes(msg.channel.id)) return;

    // Global text that ocr gets run on
    let text = "";

    // Check for attachments
    for (const attachment of msg.attachments.toJSON()) {
        if (!attachment.contentType?.includes("image")) {
            continue;
        }

        // Detect text on the image
        text += " ";
        text += await Tesseract.recognize(attachment.url, tesseractConfig);
    }

    // Text attachments
    for (const attachment of msg.attachments.toJSON()) {
        if (!attachment.contentType?.includes("text")) {
            continue;
        }

        const rawContent = await fetch(attachment.url.split("?")[0]).then(
            (res) => res.text()
        );

        text += " ";
        text += rawContent;
    }

    // Check for any urls
    const urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const urls = msg.content.match(urlRegex) ?? [];

    for (const url of urls) {
        if (!isValidImageURL(url)) {
            continue;
        }
        text += " ";
        text += await Tesseract.recognize(url, tesseractConfig);
    }

    // Finally, add the message content itself
    text += " ";
    text += msg.content;

    // Run the checks
    const matchRegular = await runRegularChecks(text);
    const matchDebug = await runDebugChecks(text);

    if (matchRegular)
        EmbedUtils.sendResponse(
            msg,
            EmbedUtils.embedColor.OK,
            matchRegular.title,
            matchRegular.footer,
            matchRegular.body.join("\n")
        );
    if (matchDebug)
        EmbedUtils.sendResponse(
            msg,
            EmbedUtils.embedColor.OK,
            matchDebug.title,
            matchDebug.footer,
            matchDebug.body.join("\n")
        );
});

/**
 * Used for message mention stuff
 */
client.on("messageCreate", async (msg) => {
    if (!msg.guild) return;

    if (
        !msg.member?.roles.cache.some((role) =>
            config.supportRoles.includes(role.id)
        )
    ) {
        return;
    }

    const regex =
        /<?https:\/\/([canary.]?)+discord.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})>?/gm;
    const matches = regex.exec(msg.content);
    if (!matches) {
        return;
    }

    if (matches[0].startsWith("<") && matches[0].endsWith(">")) {
        return;
    }

    const guildId = matches[2];
    const channelId = matches[3];
    const messageID = matches[4];

    // Check if the guild from the link is the same as the guild we are in
    if (msg.guild.id !== guildId) {
        return;
    }

    // Fetch the channel
    const channel = await msg.guild.channels.fetch(channelId).catch();
    if (!channel || !(channel instanceof TextChannel)) {
        return;
    }

    // Check if the user can view the channel
    if (!channel.permissionsFor(msg.member!)?.has("VIEW_CHANNEL")) {
        return;
    }

    const message = await channel.messages.fetch(messageID);
    if (!message) {
        return;
    }

    // If embed, send embed
    if (message.embeds[0]) {
        msg.channel.send({ embeds: [message.embeds[0]] });
        return;
    }

    // Send message content
    const embed = new MessageEmbed()
        .setAuthor(
            message.author.tag,
            message.author.avatarURL({ dynamic: true }) || ""
        )
        .setTimestamp(message.createdTimestamp)
        .setDescription(message.content)
        .setFooter(`Sent in: #${channel.name}`)
        .setColor("#FBBF24");

    msg.channel.send({ embeds: [embed] });
});

const runRegularChecks = async (text: string) => {
    text = text.replace(/\n/g, " ");
    text = text.replace(/\`/g, "'");
    text = text.replace(/\‘/g, "'");

    // Loop through each response and execute it
    delete require.cache[
        require.resolve(`../../data/${config.repositoryName}/autoresponse.js`)
    ];
    const responses = require(`../../data/${config.repositoryName}/autoresponse.js`);
    for (const response of responses) {
        if (!keywordsMatch(response.keywords, text)) {
            continue;
        }

        return response.response;
    }
};

const runDebugChecks = async (text: string) => {
    // Replace some characters that are likely falsely detected & will cause issues wth the key matching system
    text = text.replace(/\n/g, " ");
    text = text.replace(/\`/g, "'");
    text = text.replace(/\‘/g, "'");

    // Extract the debug link ID
    const regex = /https:\/\/debug\.namelessmc\.com\/([^\s]*)/gm;
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
            `../../data/${config.repositoryName}/debug_link_responses.js`
        )
    ];
    const responses = require(`../../data/${config.repositoryName}/debug_link_responses.js`);
    for (const response of responses) {
        // Check if all keywords match
        if (!keywordsMatch(response.keywords, text)) {
            continue;
        }
        // Run the check
        const returnValue = response.execute(debugContent);
        if (returnValue) {
            return returnValue;
        }
    }
};

const keywordsMatch = (keywords: any, text: string) => {
    for (const keyword of keywords) {
        const isArray = Array.isArray(keyword);
        if (isArray) {
            if (!keyword.some((key) => text.includes(key))) {
                return false;
            }
        } else {
            if (!text.includes(keyword)) {
                return false;
            }
        }
    }

    return true;
};

function isValidImageURL(text: string) {
    const cleanedURL = text.split("?")[0]; // Removes any parameters because nobody likes those
    for (const ext of config.imageExtensions) {
        if (cleanedURL.endsWith(ext)) {
            return true;
        }
    }
    return false;
}

async function getDebugContents(debugID: string) {
    const paste = await fetch(
        `https://bytebin.rkslot.nl/${encodeURIComponent(debugID)}`
    )
        .then((res) => res.json())
        .catch(() => undefined);
    if (paste) {
        return paste;
    }

    return undefined;
}
