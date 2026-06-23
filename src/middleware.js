// Middleware NextAuth — protection des routes au niveau serveur.
// S'exécute avant le rendu des pages ciblées par le `matcher`.
//
// - /account : nécessite d'être connecté.
// - /admin   : nécessite en plus le rôle ADMIN (vérifié dans le callback).
//
// C'est une double sécurité : même si le rendu client redirige déjà,
// le middleware bloque l'accès en amont.

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Section admin réservée au rôle ADMIN
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // L'utilisateur doit avoir un token (être connecté) pour passer
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
