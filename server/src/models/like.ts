import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Like = sequelize.define('Likes', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.STRING,
    }
});
