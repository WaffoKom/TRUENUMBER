import express, { Router } from "express";
import { createAdmin } from "../controllers/admin.controllers";

const router: Router = express.Router();

/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: Créer un nouvel administrateur
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 example: adminuser
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin1234
 *               phone:
 *                 type: string
 *                 example: "+237612345678"
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Administrateur créé avec succès
 *                 admin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: admin
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Requête invalide (champs manquants ou email existant)
 *       500:
 *         description: Erreur serveur
 */

router.post("/create", createAdmin);

export default router;
