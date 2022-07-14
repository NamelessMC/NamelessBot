import { DataTypes, Model } from "sequelize";
import { client } from "../..";

export default class ResponseChannel_Statistic extends Model {
    declare id: number;
    declare channelId: string;
    declare requested: number;
}

ResponseChannel_Statistic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        requested: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize: client.sequelize,
    }
);
