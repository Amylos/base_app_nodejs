const db = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

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