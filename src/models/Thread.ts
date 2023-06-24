import { DataTypes, Model } from "sequelize";
import { client } from "..";

export default class Thread extends Model {
    declare threadId: string;
    declare debugLink?: string;
    declare messageId: string;
}

Thread.init(
    {
        threadId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        debugLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        messageId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: client.sequelize,
    }
);
