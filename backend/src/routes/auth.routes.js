const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { runQuery } = require("../config/db");

const router = express.Router();

const RegisterSchema = z.object({
  company_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  plan: z.enum(["starter","pro","business"]).optional(),
});

router.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });

  const { company_name, email, password, plan } = parsed.data;

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await runQuery(
      `INSERT INTO users (company_name, email, password_hash, plan) VALUES (:company_name, :email, :password_hash, :plan)`,
      { company_name, email, password_hash, plan: plan || "starter" }
    );
    return res.json({ message: "User created", user_id: result.insertId });
  } catch (e) {
    if (String(e?.message || "").includes("UNIQUE constraint failed")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Registration error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const { email, password } = parsed.data;

  try {
    const [rows] = await runQuery("SELECT * FROM users WHERE email = :email LIMIT 1", { email });
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        company_name: user.company_name,
        plan: user.plan,
        sms_quota: user.sms_quota,
        whatsapp_enabled: !!user.whatsapp_enabled,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
