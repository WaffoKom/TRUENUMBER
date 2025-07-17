import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  CLIENT = "client",
  ADMIN = "admin",
}
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  balance: number;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CLIENT,
  },
  balance: { type: Number, default: 0 },
});

const User = mongoose.model<IUser>("User", userSchema);

export { User as userModel };
