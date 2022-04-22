import { DataTypes, Model } from "sequelize";
import { client } from "..";

export default class ReactionRole extends Model {
    declare messageId: string;
    declare emoji: string;
    declare roleId: string;
}

ReactionRole.init(
    {
        messageId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emoji: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: client.sequelize,
    }
);
