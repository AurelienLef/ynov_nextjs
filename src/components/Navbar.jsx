"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (href) =>
    pathname === href ? { color: "var(--primary)" } : {};

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: "1.4rem",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "var(--primary)" }}>Reser</span>via
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          <Link href="/" style={isActive("/")}>
            Accueil
          </Link>
          <Link href="/destinations" style={isActive("/destinations")}>
            Destinations
          </Link>

          {status === "authenticated" && (
            <Link href="/account" style={isActive("/account")}>
              Mes réservations
            </Link>
          )}

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              style={{ ...isActive("/admin"), color: "var(--accent)" }}
            >
              Admin
            </Link>
          )}

          {status === "loading" ? null : status === "authenticated" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="text-muted" style={{ fontSize: "0.88rem" }}>
                {session.user.name}
              </span>
              <button
                className="btn btn-secondary"
                style={{ padding: "8px 16px" }}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn" style={{ padding: "8px 18px" }}>
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
