import mongoose, { Document, Schema } from "mongoose";

export interface IGameHistory extends Document {
  userId: mongoose.Types.ObjectId;
  gameId: string;
  date: Date;
  generatedNumber: number;
  result: "gagné" | "perdu";
  balanceChange: number;
  newBalance: number;
}

const gameHistorySchema = new Schema<IGameHistory>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  gameId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  generatedNumber: { type: Number, required: true },
  result: { type: String, enum: ["gagné", "perdu"], required: true },
  balanceChange: { type: Number, required: true },
  newBalance: { type: Number, required: true },
});

const GameHistory = mongoose.model<IGameHistory>(
  "GameHistory",
  gameHistorySchema
);

export { GameHistory as GameHistoryModel };
