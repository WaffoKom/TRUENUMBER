import express, { Router } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { isAdmin } from "../middlewares/role.middleware";
import {
  getAllHistory,
  getUserHistory,
} from "../controllers/history.controllers";

const router: Router = express.Router();

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Récupérer l'historique des jeux de l'utilisateur connecté
 *     tags: [History]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des historiques de jeux de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: ID de l'utilisateur
 *                   gameId:
 *                     type: string
 *                   generatedNumber:
 *                     type: integer
 *                   result:
 *                     type: string
 *                     enum: [gagné, perdu]
 *                   balanceChange:
 *                     type: number
 *                   newBalance:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       500:
 *         description: Erreur serveur
 */

router.get("/", protect, getUserHistory);

// 🔸 Récupérer tout l'historique (admin uniquement)
/**
 * @swagger
 * /history/all:
 *   get:
 *     summary: Récupérer l'historique de tous les utilisateurs (Admin uniquement)
 *     tags: [History]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des historiques de jeu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   gameId:
 *                     type: string
 *                   generatedNumber:
 *                     type: integer
 *                   result:
 *                     type: string
 *                     enum: [gagné, perdu]
 *                   balanceChange:
 *                     type: number
 *                   newBalance:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non autorisé (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (réservé aux administrateurs)
 *       500:
 *         description: Erreur serveur
 */

router.get("/all", protect, isAdmin, getAllHistory);

export default router;
