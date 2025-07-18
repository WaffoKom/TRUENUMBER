import express, { Router } from "express";
import { Request, Response } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { userModel } from "../models/user.models";

const router: Router = express.Router();

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Récupérer le solde de l'utilisateur connecté
 *     tags:
 *       - Balance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solde récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   example: 150
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
router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.user?.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.json({ balance: user.balance });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
