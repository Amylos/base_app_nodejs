const mysql = require("mysql2");
const env = require("./env");

const connection = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});

connection.connect((err) => {

    if (err) {
        console.error(
            "❌ MySQL connection failed:",
            err.message
        );
        return;
    }

    console.log(
        "✅ Connected to MySQL database:",
        env.DB_NAME
    );
});

module.exports = connection;