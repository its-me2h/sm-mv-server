import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Sport = sequelize.define('Sports', {
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
    },
    CountPros: {
        type: DataTypes.INTEGER,
    }
});