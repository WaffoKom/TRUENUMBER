import express, { Router } from "express";
import { Request, Response } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { isAdmin } from "../middlewares/role.middleware";
import { GameHistoryModel } from "../models/cameHistory.models";
import {
  getAllHistory,
  getUserHistory,
} from "../controllers/history.controllers";

const router: Router = express.Router();

router.get("/", protect, getUserHistory);

// 🔸 Récupérer tout l'historique (admin uniquement)
router.get("/all", protect, isAdmin, getAllHistory);

export default router;
