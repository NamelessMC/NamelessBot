import { GuildChannel } from "discord.js";
import Response_Statistic from "../models/statistics/Response.statistic";
import ResponseChannel_Statistic from "../models/statistics/ResponseChannel.statistics";
import { AutoResponse, JsonEmbedResponse } from "../types";
import AutoResponseManager from "./AutoResponseManager";

export default class {
    public static async SaveResponse(
        response: JsonEmbedResponse,
        channel: GuildChannel
    ) {
        const mngr = new AutoResponseManager("");
        const path = mngr.responsesFile;

        const responses = require(path) as AutoResponse[];
        const responseIndex = responses.findIndex(
            (r) => r.response.title === response.title
        );
        if (responseIndex === -1) {
            return;
        }

        // Keep track how many times the response was requested
        const [item, _created] = await Response_Statistic.findOrCreate({
            where: {
                id: responseIndex,
            },
            defaults: {
                title: response.title,
                id: responseIndex,
            },
        });

        item.requested++;
        await item.save();

        // Keep track in what channel the response was requested
        const id = channel.isThread() ? "thread" : channel.id;
        const [item2, _created2] = await ResponseChannel_Statistic.findOrCreate(
            {
                where: {
                    channelId: id,
                },
                defaults: {
                    channelId: id,
                },
            }
        );
        item2.requested++;
        await item2.save();
    }
}
