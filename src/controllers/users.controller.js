const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;

        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: "User created successfully"
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], async (err, results) => {

        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict",
            maxAge: 3600000
        });

        res.json({
            message: "Login successful"
        });
    });
};

exports.logout = (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false
  });

  res.json({
    message: "Logged out successfully"
  });
};

exports.profile = (req, res) => {

    res.json({
        message: "Protected route",
        user: req.user
    });
};