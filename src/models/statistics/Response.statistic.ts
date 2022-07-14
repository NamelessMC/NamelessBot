import { DataTypes, Model } from "sequelize";
import { client } from "../..";

export default class Response_Statistic extends Model {
    declare id: number;
    declare title: string;
    declare requested: number;
}

Response_Statistic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
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
