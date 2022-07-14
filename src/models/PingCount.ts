import { DataTypes, Model } from "sequelize";
import { client } from "..";

export default class PingCount extends Model {
    declare userId: string;
    declare count: number;
}

PingCount.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize: client.sequelize,
    }
);
