import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const User = sequelize.define('Users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    isPro: {
        type: DataTypes.BOOLEAN,
    },
    userName: {
        type: DataTypes.STRING,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    avatarURL: {
        type: DataTypes.STRING,
    },
    coverURL: {
        type: DataTypes.STRING,
    }
});
