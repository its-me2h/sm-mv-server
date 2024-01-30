import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";

export const Plan = sequelize.define('Plans', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    proId: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    }
});