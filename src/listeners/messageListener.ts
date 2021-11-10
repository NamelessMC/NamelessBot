import { client, config } from '../index';
import Tesseract from 'tesseract.js';
import EmbedUtils from '../constants/EmbedUtil';
import fetch from 'node-fetch';

client.on('messageCreate', async (msg) => {
    if (!msg.guild) return;
    if (msg.guild.id !== config.guildID) return;
    if (config.channelExclusions.autoresponses.includes(msg.channel.id)) return;

    // Global text that ocr gets run on
    let text = "";

    
    // Check for attachments
    for (const attachment of msg.attachments.toJSON()) {
        
        if (!attachment.contentType?.includes('image')) {
            continue;
        }
        
        // Detect text on the image
        text += " ";
        text += await Tesseract.recognize(
            attachment.url,
            'eng'
        ).then((res) => res.data.text);   
    }
        
    // Check for any urls
    const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const urls = msg.content.match(urlRegex) ?? [];
    
    for (const url of urls) {
        if (!isValidImageURL(url)) {
            continue;
        }
        text += " ";
        text += await Tesseract.recognize(
            url,
            'eng'
        ).then((res) => res.data.text);
    }
        
    // Finally, add the message content itself
    text += " ";
    text += msg.content;
    
    // Run the checks
    const matchRegular = await runRegularChecks(text);
    const matchDebug = await runDebugChecks(text);

    if (matchRegular) EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.OK, matchRegular.title, matchRegular.footer, matchRegular.body.join('\n'));
    if (matchDebug) EmbedUtils.sendResponse(msg, EmbedUtils.embedColor.OK, matchDebug.title, matchDebug.footer, matchDebug.body.join('\n'));
})

const runRegularChecks = async (text: string) => {

    text = text.replace(/\n/g, ' ');
    text = text.replace(/\`/g, '\'');
    text = text.replace(/\‘/g, '\'');

    // Loop through each response and execute it
    const responses = require(`../../data/${config.repositoryName}/autoresponse.json`);
    for (const response of responses) {
        if (!keywordsMatch(response.keywords, text)) {
            continue;
        }

        return response.response;
    }
}

const runDebugChecks = async (text: string) => {

    // Replace some characters that are likely falsely detected & will cause issues wth the key matching system
    text = text.replace(/\n/g, ' ');
    text = text.replace(/\`/g, '\'');
    text = text.replace(/\‘/g, '\'');

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

    const responses = require(`../../data/${config.repositoryName}/debugLink_responses.js`);
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
}

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
}

function isValidImageURL(text: string) {
    
    const cleanedURL = text.split('?')[0] // Removes any parameters because nobody likes those
    for (const ext of config.imageExtensions) {
        if (cleanedURL.endsWith(ext)) {
            return true;
        }
    }
    return false;
}

async function getDebugContents(debugID: string) {

    const paste = await fetch(`https://bytebin.rkslot.nl/${encodeURIComponent(debugID)}`).then((res) => res.json()).catch(() => undefined);
    if (paste) {
        return paste;
    }

    return undefined;
}
