import { DataTypes, Model } from "sequelize";
import { client } from "../..";

export default class ThreadCreation_Statistic extends Model {
    declare id: number;
    declare day: number;
    declare month: number;
    declare year: number;
    declare amount: number;
}

ThreadCreation_Statistic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        day: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize: client.sequelize,
    }
);
