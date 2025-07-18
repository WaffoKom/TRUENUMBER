import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel, IUser } from "../models/user.models";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = new userModel({
      username,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();
    res.status(201).json({ message: "Compte créé avec succès", user });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found." });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password." });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY ?? "",
      {
        expiresIn: "1d",
      }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        token,
        user: { id: user._id, username: user.username, role: user.role },
      });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "Déconnecté avec succès" });
};
