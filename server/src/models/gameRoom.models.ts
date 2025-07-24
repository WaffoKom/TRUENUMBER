// models/GameRoom.ts
import mongoose, { Document, Schema } from "mongoose";

export type GameStatus = "waiting" | "ongoing" | "finished";

export interface IGameRoom extends Document {
  creator: mongoose.Types.ObjectId;
  opponent?: mongoose.Types.ObjectId;
  stake: number;
  timeLimit: number;
  creatorNumber?: number;
  opponentNumber?: number;
  winner?: mongoose.Types.ObjectId;
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const GameRoomSchema = new Schema<IGameRoom>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    opponent: { type: Schema.Types.ObjectId, ref: "User" },
    stake: { type: Number, required: true },
    timeLimit: { type: Number, required: true }, // en secondes
    creatorNumber: { type: Number },
    opponentNumber: { type: Number },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["waiting", "ongoing", "finished"],
      default: "waiting",
    },
    expiresAt: { type: Date }, // Pour les timeouts automatiques
  },
  { timestamps: true }
);

const gameRoom = mongoose.model<IGameRoom>("GameRoom", GameRoomSchema);

export { gameRoom as GameRoomModel };
