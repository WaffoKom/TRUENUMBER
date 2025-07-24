import { Request, Response } from "express";
import { GameRoomModel } from "../models/gameRoom.models";
import { userModel } from "../models/user.models";
import { GameHistoryModel } from "../models/cameHistory.models";
import mongoose from "mongoose";

// Créer une partie
export const createGameRoom = async (req: Request, res: Response) => {
  const { stake, timeLimit } = req.body;
  const userId = req.user?.id;

  if (!stake || !timeLimit) {
    return res.status(400).json({ message: "Mise et temps requis." });
  }

  const user = await userModel.findById(userId);
  if (!user || user.balance < stake) {
    return res
      .status(400)
      .json({ message: "Solde insuffisant pour créer une partie." });
  }

  // Déduire la mise du solde du créateur
  user.balance -= stake;
  await user.save();

  const gameRoom = await GameRoomModel.create({
    creator: userId,
    stake,
    timeLimit,
  });

  res.status(201).json(gameRoom);
};

// Récupérer les parties en attente
export const getWaitingGames = async (_req: Request, res: Response) => {
  const waitingGames = await GameRoomModel.find({ status: "waiting" }).populate(
    "creator",
    "username"
  );
  res.json(waitingGames);
};

// Rejoindre une partie
export const joinGameRoom = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  const game = await GameRoomModel.findById(gameId);
  if (!game || game.status !== "waiting") {
    return res
      .status(404)
      .json({ message: "Partie non trouvée ou déjà commencée." });
  }

  if (game.creator.toString() === userId) {
    return res
      .status(400)
      .json({ message: "Vous ne pouvez pas rejoindre votre propre partie." });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé." });
  }

  // Conversion explicite en nombre
  const stake = Number(game.stake);
  const balance = Number(user.balance);

  if (isNaN(stake) || isNaN(balance)) {
    return res
      .status(500)
      .json({ message: "Erreur interne: données invalides." });
  }

  if (balance < stake) {
    return res
      .status(400)
      .json({ message: "Solde insuffisant pour rejoindre cette partie." });
  }

  // Déduire la mise du solde du joueur 2
  user.balance = balance - stake;
  await user.save();

  game.opponent = new mongoose.Types.ObjectId(userId);
  game.status = "ongoing";
  await game.save();

  res.json({ message: "Partie rejointe avec succès.", game });
};
export const playTurn = async (req: Request, res: Response) => {
  try {
    const gameId: string = req.params.id;
    const userId: string | undefined = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const game = (await GameRoomModel.findById(gameId)) as mongoose.Document & {
      _id: mongoose.Types.ObjectId;
      creator: mongoose.Types.ObjectId;
      opponent?: mongoose.Types.ObjectId;
      stake: number;
      timeLimit: number;
      status: string;
      creatorNumber?: number;
      opponentNumber?: number;
      winner?: mongoose.Types.ObjectId;
    };
    if (!game || game.status !== "ongoing") {
      return res
        .status(404)
        .json({ message: "Partie introuvable ou non en cours." });
    }

    // Générer un nombre aléatoire entre 0 et 100
    const generatedNumber: number = Math.floor(Math.random() * 101);

    const isCreator: boolean = game.creator.toString() === userId;
    const isOpponent: boolean = game.opponent?.toString() === userId;

    if (!isCreator && !isOpponent) {
      return res
        .status(403)
        .json({ message: "Vous ne participez pas à cette partie." });
    }

    // Vérifier si le joueur a déjà joué
    if (isCreator && game.creatorNumber !== undefined) {
      return res.status(400).json({ message: "Vous avez déjà joué." });
    }
    if (isOpponent && game.opponentNumber !== undefined) {
      return res.status(400).json({ message: "Vous avez déjà joué." });
    }

    // Enregistrer le nombre généré dans la partie
    if (isCreator) {
      game.creatorNumber = generatedNumber;
    } else {
      game.opponentNumber = generatedNumber;
    }

    await game.save();

    // Si les deux joueurs ont joué, déterminer le gagnant
    if (game.creatorNumber !== undefined && game.opponentNumber !== undefined) {
      const creatorDiff: number = Math.abs(game.creatorNumber - 50);
      const opponentDiff: number = Math.abs(game.opponentNumber - 50);

      type WinnerType = "creator" | "opponent" | "draw";
      let winner: WinnerType = "draw";

      if (creatorDiff < opponentDiff) winner = "creator";
      else if (opponentDiff < creatorDiff) winner = "opponent";

      const stake: number = game.stake;

      const creatorUser = await userModel.findById(game.creator);
      const opponentUser = await userModel.findById(game.opponent);

      if (!creatorUser || !opponentUser) {
        return res
          .status(500)
          .json({ message: "Erreur chargement utilisateurs." });
      }

      // Mise à jour des soldes en fonction du résultat
      if (winner === "creator") {
        creatorUser.balance += stake;
        opponentUser.balance -= stake;
        game.winner = creatorUser._id as mongoose.Types.ObjectId;
      } else if (winner === "opponent") {
        opponentUser.balance += stake;
        creatorUser.balance -= stake;
        game.winner = opponentUser._id as mongoose.Types.ObjectId;
      }
      // En cas d'égalité, pas de changement de solde ni de gagnant

      game.status = "finished";

      await Promise.all([game.save(), creatorUser.save(), opponentUser.save()]);

      // Création des historiques strictement conformes au modèle
      const creatorHistory = new GameHistoryModel({
        userId: creatorUser._id,
        gameId: game._id.toString(),
        generatedNumber: game.creatorNumber,
        result: winner === "creator" ? "gagné" : "perdu",
        balanceChange:
          winner === "creator" ? stake : winner === "opponent" ? -stake : 0,
        newBalance: creatorUser.balance,
      });

      const opponentHistory = new GameHistoryModel({
        userId: opponentUser._id,
        gameId: game._id.toString(),
        generatedNumber: game.opponentNumber,
        result: winner === "opponent" ? "gagné" : "perdu",
        balanceChange:
          winner === "opponent" ? stake : winner === "creator" ? -stake : 0,
        newBalance: opponentUser.balance,
      });

      await Promise.all([creatorHistory.save(), opponentHistory.save()]);

      return res.json({
        message: "Partie terminée.",
        winner:
          winner === "creator"
            ? creatorUser.username
            : winner === "opponent"
            ? opponentUser.username
            : "Égalité",
        game,
      });
    }

    // Si un seul joueur a joué
    return res.json({
      message: "Tour joué avec succès. En attente de l'autre joueur.",
      generatedNumber,
    });
  } catch (error) {
    console.error("playTurn error:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
// Voir toutes les parties du joueur
export const getAllGamesForUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const games = await GameRoomModel.find({
    $or: [{ creator: userId }, { opponent: userId }],
  }).sort({ createdAt: -1 });

  res.json(games);
};
