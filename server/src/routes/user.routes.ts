import express, { Router } from "express";
import {
  getMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers";
import { protect } from "../middlewares/auth.middlewares";
import { isAdmin } from "../middlewares/role.middleware";

const router: Router = express.Router();

router.get("/me", protect, getMe);

router.use(protect);
router.use(isAdmin);

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
