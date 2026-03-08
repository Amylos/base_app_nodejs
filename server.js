const express = require('express');
const app = express();
const usersRouter = require('./src/routes/users.route');
const securityRouter = require('./src/routes/security.route');

const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/security', securityRouter);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});