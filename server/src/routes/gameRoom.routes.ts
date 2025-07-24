import express from "express";
import {
  createGameRoom,
  getWaitingGames,
  joinGameRoom,
  playTurn,
  getAllGamesForUser,
} from "../controllers/gameRoom.controllers";
import { protect } from "../middlewares/auth.middlewares";

const router = express.Router();

// Créer une partie
router.post("/", protect, createGameRoom);

// Lister les parties en attente
router.get("/waiting", protect, getWaitingGames);

// Rejoindre une partie
router.post("/:id/join", protect, joinGameRoom);

// Jouer (générer un nombre)
router.post("/:id/play", protect, playTurn);

// Voir toutes les parties d’un utilisateur
router.get("/my-games", protect, getAllGamesForUser);

export default router;
