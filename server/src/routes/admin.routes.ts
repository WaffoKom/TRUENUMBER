import express, { Router } from "express";
import { createAdmin } from "../controllers/admin.controllers";

const router: Router = express.Router();

router.post("/create", createAdmin);

export default router;
