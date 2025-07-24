import { Request, Response } from "express";
import { GameRoomModel } from "../models/gameRoom.models";
import { userModel } from "../models/user.models";
import { GameHistoryModel } from "../models/cameHistory.models";

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

  const gameRoom = await GameRoomModel.create({
    creator: userId,
    stake,
    timeLimit,
  });

  res.status(201).json(gameRoom);
};

export const getWaitingGames = async (_req: Request, res: Response) => {
  const waitingGames = await GameRoomModel.find({ status: "waiting" }).populate(
    "creator",
    "username"
  );
  res.json(waitingGames);
};

export const joinGameRoom = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const userId = req.user?.id;

  const game = await GameRoomModel.findById(gameId);
  if (!game || game.status !== "waiting") {
    return res
      .status(404)
      .json({ message: "Partie non trouvée ou déjà commencée." });
  }

  const user = await userModel.findById(userId);
  if (!user || user.balance < game.stake) {
    return res
      .status(400)
      .json({ message: "Solde insuffisant pour rejoindre cette partie." });
  }

  game.opponent = userId
    ? require("mongoose").Types.ObjectId(userId)
    : undefined;
  game.status = "ongoing";
  await game.save();

  res.json({ message: "Partie rejointe avec succès.", game });
};

export const playTurn = async (req: Request, res: Response) => {
  const gameId = req.params.id;
  const userId = req.user?.id;

  const game = await GameRoomModel.findById(gameId);
  if (!game || game.status !== "ongoing") {
    return res
      .status(404)
      .json({ message: "Partie introuvable ou déjà terminée." });
  }

  const random = Math.floor(Math.random() * 101);

  if (userId === game.creator.toString()) {
    if (game.creatorNumber !== undefined)
      return res.status(400).json({ message: "Vous avez déjà joué." });
    game.creatorNumber = random;
  } else if (userId === game.opponent?.toString()) {
    if (game.opponentNumber !== undefined)
      return res.status(400).json({ message: "Vous avez déjà joué." });
    game.opponentNumber = random;
  } else {
    return res
      .status(403)
      .json({ message: "Vous ne faites pas partie de cette partie." });
  }

  await game.save();

  // Vérifie si les deux joueurs ont joué
  if (game.creatorNumber !== undefined && game.opponentNumber !== undefined) {
    const winnerId =
      game.creatorNumber > game.opponentNumber ? game.creator : game.opponent;
    const loserId =
      game.creatorNumber < game.opponentNumber ? game.creator : game.opponent;

    game.winner = winnerId;
    game.status = "finished";
    await game.save();

    await userModel.findByIdAndUpdate(winnerId, {
      $inc: { balance: game.stake },
    });
    await userModel.findByIdAndUpdate(loserId, {
      $inc: { balance: -game.stake },
    });

    // Historique
    await GameHistoryModel.create({
      user: game.creator,
      gameType: "interactive",
      result: game.creator.equals(winnerId) ? "win" : "lose",
      stake: game.stake,
    });

    await GameHistoryModel.create({
      user: game.opponent,
      gameType: "interactive",
      result: game.opponent?.equals(winnerId) ? "win" : "lose",
      stake: game.stake,
    });
  }

  res.json({ message: "Nombre généré.", nombre: random });
};

export const getAllGamesForUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const games = await GameRoomModel.find({
    $or: [{ creator: userId }, { opponent: userId }],
  }).sort({ createdAt: -1 });

  res.json(games);
};
