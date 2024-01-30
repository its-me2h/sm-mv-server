import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Bookmark = sequelize.define('Bookmarks', {
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