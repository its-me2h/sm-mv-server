import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Team = sequelize.define('Teams', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    mediaURL: {
        type: DataTypes.STRING,
    }
});