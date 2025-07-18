import { Request, Response } from "express";
import { userModel, UserRole } from "../models/user.models";
import bcrypt from "bcryptjs";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone } = req.body;

    // Validation des champs
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérification si l'email existe déjà
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'admin (le rôle est forcé à ADMIN)
    const admin = await userModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.ADMIN, // Rôle explicitement défini
    });

    // Réponse sans le mot de passe (bonne pratique)
    const { password: _, ...adminData } = admin.toObject();

    res.status(201).json({
      message: "Administrateur créé avec succès",
      admin: adminData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
