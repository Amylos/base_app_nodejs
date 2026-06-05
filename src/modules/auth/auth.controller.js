const db = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Missing fields"
        });
    }

    try {
        // 1. check duplicates FIRST
        const checkQuery =
            "SELECT id FROM users WHERE username = ? OR email = ?";

        db.query(checkQuery, [username, email], async (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "User already exists"
                });
            }

            // 2. hash password
            const hashedPassword =
                await bcrypt.hash(password, 10);

            // 3. optional verification system
            const verificationToken =
                crypto.randomBytes(32).toString("hex");

            const verificationExpires =
                new Date(Date.now() + 24 * 60 * 60 * 1000);

            // 4. insert user
            const insertQuery = `
                INSERT INTO users (
                    username,
                    email,
                    password_hash,
                    verification_token,
                    verification_expires
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [
                    username,
                    email,
                    hashedPassword,
                    verificationToken,
                    verificationExpires
                ],
                (err2) => {

                    if (err2) {
                        console.error("Insert error:", err2);

                        return res.status(500).json({
                            error: err2.message
                        });
                    }

                    return res.status(201).json({
                        message: "User created successfully"
                    });
                }
            );
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};

// --- LOGIN ---
exports.login = (req, res) => {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    const query =
        `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = results[0];

        const match =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!match) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Generated JWT:", token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 3600000
        });
        console.log("Token set in cookie");
        res.json({
            message: "Login successful"
        });
    });
};


// --- VERIFY EMAIL ---
exports.verifyEmail = (req, res) => {

    const { token } = req.params;

    const query = `
        SELECT * FROM users
        WHERE verification_token = ?
    `;

    db.query(query, [token], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const user = results[0];

        if (
            user.verification_expires &&
            new Date(user.verification_expires) < new Date()
        ) {
            return res.status(400).json({
                message: "Token expired"
            });
        }

        const updateQuery = `
            UPDATE users
            SET is_verified = TRUE,
                verification_token = NULL,
                verification_expires = NULL
            WHERE id = ?
        `;

        db.query(updateQuery, [user.id], (err2) => {

            if (err2) {
                return res.status(500).json({
                    error: err2.message
                });
            }

            return res.json({
                message: "Email successfully verified 🎉"
            });
        });
    });
};


// --- LOGOUT ---
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

