import express, { Router } from "express";
import { Request, Response } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { userModel } from "../models/user.models";

const router: Router = express.Router();

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
