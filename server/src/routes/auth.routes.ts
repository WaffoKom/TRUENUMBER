import express, { Router } from "express";

import { register, login, logout } from "../controllers/auth.controllers";

const router: Router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Enregistrer un utilisateur
 *     tags: [Auth]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 */
router.post("/register", register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Informations d'authentification
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: utilisateur@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Qwerty123!
 *     responses:
 *       200:
 *         description: Connexion réussie avec token JWT et infos utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT d'authentification
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f72c94aaf12e0012345678
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     role:
 *                       type: string
 *                       example: client
 *       400:
 *         description: Email non trouvé ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email not found. / Incorrect password.
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
 */
router.post("/login", login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Déconnexion réussie, cookie supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnecté avec succès
 */
router.post("/logout", logout);

export default router;
