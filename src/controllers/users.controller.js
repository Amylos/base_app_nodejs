const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const { sendVerificationEmail } = require("../services/mail.service");

const { sendTestEmail } = require("../services/mail.service");

exports.sendTestEmail = async (req, res) => {
    try {
        console.log("🔥 testmail route called");

        await sendTestEmail("test@example.com");

        res.json({ message: "Email sent (check console)" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};




// --- Add user's profile ---
exports.register = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const verificationExpires = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
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
            query,
            [
                username,
                email,
                hashedPassword,
                verificationToken,
                verificationExpires
            ],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                await sendVerificationEmail(email, verificationToken);

                return res.status(201).json({
                    message: "User created. Check your email to verify your account."
                });
            }
        );

    } catch (error) {
        return res.status(500).json({ error: error.message });
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

exports.verifyEmail = (req, res) => {
    const { token } = req.params;

    const query = `
        SELECT * FROM users
        WHERE verification_token = ?
    `;

    db.query(query, [token], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const user = results[0];

        if (user.verification_expires &&
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
                return res.status(500).json({ error: err2.message });
            }

            return res.json({
                message: "Email successfully verified 🎉"
            });
        });
    });
};

exports.sendTestEmail = async (req, res) => {
    try {
        await sendVerificationEmail(
            "your_email_here@test.com",
            "test-token-123"
        );

        res.json({
            message: "Test email sent"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

// --- List user's profile ---
exports.profile = (req, res) => {
    res.json({
        message: "Protected route",
        user: req.user
    });
};


// --- List all users ---
exports.listUsers = (req, res) => {
  const query = "SELECT id, username, email, role, created_at FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// --- Update user role ---
exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const query = "UPDATE users SET role = ? WHERE id = ?";
  db.query(query, [role, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User role updated" });
  });
};

// --- Delete user ---
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted" });
  });
};