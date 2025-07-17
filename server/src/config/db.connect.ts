import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// console.log("📦 Toutes les variables :", process.env);

export async function connectToDB() {
  const mongoDBURL = process.env.DB_URL ?? "";
  console.log("🔎 URL MongoDB utilisée :", mongoDBURL); // 👈 Ajout temporaire
  try {
    const db = await mongoose.connect(mongoDBURL);
    console.log("Connecté à la base de données MongoDB");
    return db;
  } catch (error: any) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    throw error; // 👉 très important !
  }
}

export async function closeConnexion() {
  await mongoose.connection.close();
  console.log("Connexion à la base de données fermée");
}
