import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await argon2.hash(password);
    const user = await User.create({
      ...req.body,
      password: hashed,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      id: user._id,
      email: user.email,
      userName: user.userName,
      avatar: user.avatar,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    res.json({ token, user});
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
