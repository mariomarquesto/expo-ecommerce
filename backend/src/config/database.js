import { Sequelize } from "sequelize";
import { ENV } from "./env.js";

export const sequelize = new Sequelize(ENV.DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: ENV.NODE_ENV === "production"
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
});




