import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Follow = sequelize.define('Follows', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
    },
    proId: {
        type: DataTypes.STRING,
    }
});
