import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Pro = sequelize.define('Pros', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    sportId: {
        type: DataTypes.STRING,
    },
    teamId: {
        type: DataTypes.STRING,
    },
    countPosts: {
        type: DataTypes.INTEGER,
    },
    countFollowers: {
        type: DataTypes.INTEGER,
    },
    countSubscribers: {
        type: DataTypes.INTEGER,
    }
});
