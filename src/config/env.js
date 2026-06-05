require("dotenv").config();

const env = {
    // SERVER
    PORT: process.env.SERVER_PORT || 3000,
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",

    // DATABASE
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,

    // AUTH
    JWT_SECRET: process.env.JWT_SECRET,

    // SMTP / EMAIL
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM
};

module.exports = env;