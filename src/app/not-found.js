import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary)" }}>
        404
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: 24 }}>
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn">
        Retour à l'accueil
      </Link>
    </div>
  );
}
