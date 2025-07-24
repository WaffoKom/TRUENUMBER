import { Request, Response } from "express";
import { userModel, IUser } from "../models/user.models";
import bcrypt from "bcryptjs";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.user?.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new userModel({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
      balance: 100,
    });

    await newUser.save();

    // res.status(201).json({ message: "Utilisateur créé", user: newUser });

    res.status(201).json({
      message: "Utilisateur créé",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        balance: newUser.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, phone, role } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { username, email, phone, role }, { new: true })
      .select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
