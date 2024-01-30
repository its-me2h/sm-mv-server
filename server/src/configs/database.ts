import { Sequelize } from "sequelize";

// DATABASE CONNECTION CONFIGURATION
const databaseName: string = "sql3679792";
const databaseUser: string = "sql3679792";
const databasePassword: string = "jJVFEdVKWN";
const databaseConfig: any = {
    dialect: "mysql",
    host: "sql3.freemysqlhosting.net",
};

// ESTABLISH DATABASE CONNECTION
const sequelize: Sequelize = new Sequelize(
    databaseName,
    databaseUser,
    databasePassword,
    databaseConfig
);

// AUTHENTICATE DATABASE CONNECTION
const authenticateDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
    } catch (error) {
        console.log("Database error: " + error);
    }
};

// sequelize.sync()

export {
    authenticateDatabase,
    sequelize
};
