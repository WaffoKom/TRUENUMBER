import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY ?? "";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Pas de token : redirige vers /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Vérifie que le token est valide (sinon on renvoie une erreur)
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next(); // token valide, continue la requête
  } catch {
    // Token invalide ou expiré, redirige vers /login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
const basePaths = ["/dashboard", "/admin/dashboard"];

export const config = {
  matcher: basePaths.flatMap((base) => [base, `${base}/:path*`]),
};
