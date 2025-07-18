import express, { Router } from "express";
import { playGame } from "../controllers/game.controllers";
import { protect } from "../middlewares/auth.middlewares";

const router: Router = express.Router();

/**
 * @swagger
 * /api/game/play:
 *   post:
 *     summary: Lancer une partie
 *     tags:
 *       - Game
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Résultat du jeu et nouveau solde retournés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   enum: [gagné, perdu]
 *                   example: gagné
 *                 generatedNumber:
 *                   type: integer
 *                   description: Nombre aléatoire généré entre 0 et 100
 *                   example: 85
 *                 newBalance:
 *                   type: number
 *                   description: Nouveau solde de l'utilisateur après la partie
 *                   example: 215
 *       401:
 *         description: Non autorisé (utilisateur non connecté)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur serveur
 *                 error:
 *                   type: string
 */
router.post("/play", protect, playGame);

export default router;
