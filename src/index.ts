// Imports
import { Client, Intents } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';

import CloneGitRepository from './util/CloneGitRepository';
import CommandHandler from './commands/commandHandler/commandHandler';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
    presence: {
        activities: [
            {
                name: '>help | namelessmc.com',
                type: 'PLAYING',
            }
        ]
    }
});

const config = JSON.parse(readFileSync('./config.json', 'utf8'));

// Load commands
const cmdHandler = new CommandHandler(client);
cmdHandler.loadCommands();

export {
    client,
    config,
}

// Clone from the github repository to ensure we have the latest files
CloneGitRepository(`${config.organizationName}/${config.repositoryName}`, config.branch, join(__dirname, '../../../data'));

// OCR
import './listeners/messageListener';

client.on('ready', () => {
    console.log(`${client.user?.username} is ready...`);
});

client.login(config.token);