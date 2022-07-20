import { DataTypes, Model } from "sequelize";
import { client } from "../..";

export default class Statistic_Statistic extends Model {
    declare id: number;
    declare name: string;
    declare value: number;
}

Statistic_Statistic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize: client.sequelize,
    }
);
