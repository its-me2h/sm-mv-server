import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Comment = sequelize.define('Comments', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
    }
});
