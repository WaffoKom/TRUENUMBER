import express from "express";
import { Request, Response } from "express";
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

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "localhost://3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use((req: Request, res: Response, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

const PORT = process.env.PORT || 7200;

async function main() {
  // ... (Code de configuration de l'application)
  try {
    await connectToDB(); // 👈 Connexion d'abord
  } catch (err) {
    console.error("🚫 Le serveur ne démarrera pas sans base de données !");
    process.exit(1); // 👉 quitte l’application
  }

  app.get("/", (req, res) => {
    res.status(200).send("Hello world");
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/game", gameRoutes);
  app.use("/api/balance", balanceRoutes);
  app.use("/api/history", historyRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.listen(PORT, () =>
    console.log(`Connexion etablit avec succes au port ${PORT}`)
  );
}
export default app;

main();
