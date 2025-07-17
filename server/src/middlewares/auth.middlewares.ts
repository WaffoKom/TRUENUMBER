import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!);
    req.user = decoded as { id: string; role: string };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
