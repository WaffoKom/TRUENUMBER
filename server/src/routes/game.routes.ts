import express, { Router } from "express";
import { playGame } from "../controllers/game.controllers";
import { protect } from "../middlewares/auth.middlewares";

const router: Router = express.Router();
router.post("/play", protect, playGame);

export default router;
