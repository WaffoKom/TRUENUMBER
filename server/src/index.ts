import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import { connectToDB } from "./config/db.connect";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import gameRoutes from "./routes/game.routes";
import balanceRoutes from "./routes/balance.routes";
import historyRoutes from "./routes/history.routes";

dotenv.config(); // Charge les variables d'env

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sécurité : activer helmet seulement en production
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// CORS : origine différente selon environnement
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Pour les popups Google OAuth
app.use((req: Request, res: Response, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

const PORT = process.env.PORT || 7200;

async function main() {
  try {
    await connectToDB();
  } catch (err) {
    console.error("🚫 Le serveur ne démarrera pas sans base de données !");
    process.exit(1);
  }

  // Routes
  app.get("/", (req, res) => {
    res.status(200).send("Hello world");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/game", gameRoutes);
  app.use("/api/balance", balanceRoutes);
  app.use("/api/history", historyRoutes);
  app.use("/api/admin", adminRoutes);

  // Swagger activé seulement en développement
  if (process.env.NODE_ENV !== "production") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.listen(PORT, () => {
    console.log(
      `✅ Serveur lancé sur le port ${PORT} en mode ${process.env.NODE_ENV}`
    );
  });
}

export default app;
main();
