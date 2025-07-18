import { Request, Response } from "express";
import { GameHistoryModel } from "../models/cameHistory.models";

export const getUserHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Non autorisé" });

    const history = await GameHistoryModel.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export const getAllHistory = async (req: Request, res: Response) => {
  try {
    const allHistory = await GameHistoryModel.find().sort({ date: -1 });
    res.json(allHistory);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
