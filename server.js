const express = require('express');
const app = express();

const authRouter = require("./src/modules/auth/auth.routes");
const userRouter = require("./src/modules/user/user.routes");

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

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});