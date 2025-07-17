import { Request, Response } from "express";
import { GameHistoryModel, IGameHistory } from "../models/cameHistory.models";
import { userModel } from "../models/user.models";
import { v4 as uuidv4 } from "uuid";

export const playGame = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const generatedNumber = Math.floor(Math.random() * 101); // 0 à 100
    let result: "gagné" | "perdu";
    let balanceChange = 0;

    if (generatedNumber <= 70) {
      result = "perdu";
      balanceChange = -35;
    } else {
      result = "gagné";
      balanceChange = 50;
    }
    user.balance += balanceChange;
    await user.save();

    const gameRecord: IGameHistory = new GameHistoryModel({
      userId: user._id,
      gameId: uuidv4(),
      generatedNumber,
      result,
      balanceChange,
      newBalance: user.balance,
    });

    await gameRecord.save();
    res.json({ result, generatedNumber, newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
