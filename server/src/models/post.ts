import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Post = sequelize.define('Posts', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    proId: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
    },
    mediaURL: {
        type: DataTypes.STRING,
    }
});
