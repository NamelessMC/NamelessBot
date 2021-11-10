import { Message } from "discord.js";
import CloneGitRepository from "../../util/CloneGitRepository";
import { config } from "../../index";
import { join } from "path";

class updateDataCommand {

    public name: string;
    public description: string;

    constructor() {
        this.name = "updatedata";
        this.description = "Download all latest data from the github repository";
    }

    public async execute(msg: Message, args: string[]) {

        if (!config.botowners.includes(msg.author.id)) {
            msg.channel.send("You are not allowed to use this command!");
            return;
        }
        
        msg.channel.send("Updating data...");
        await CloneGitRepository(`${config.organizationName}/${config.repositoryName}`, config.branch, join(__dirname, '../../../data'));

        // Delete auto responses cached data and re-import it
        delete require.cache[require.resolve(`../../../data/${config.repositoryName}/autoresponse.json`)];
        delete require.cache[require.resolve(`../../../data/${config.repositoryName}/debugLink_response.js`)];

        require(`../../../data/${config.repositoryName}/autoresponse.json`);
        require(`../../../data/${config.repositoryName}/debugLink_response.js`);

        msg.channel.send("Data updated!");
    }
}

export default updateDataCommand;