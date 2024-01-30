import { DataTypes } from "sequelize"
import { sequelize } from "../configs/database";
import { User } from "./user";
import { Plan } from "./plan";

export const Subscription = sequelize.define('Subscriptions', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
    },
    planId: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.DATE,
    },
    endDate: {
        type: DataTypes.DATE,
    }
});

Subscription.belongsTo(User, { foreignKey: "userId" });
Subscription.belongsTo(Plan, { foreignKey: "planId" });