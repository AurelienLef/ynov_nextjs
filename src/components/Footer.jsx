export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        marginTop: 60,
        padding: "32px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          color: "var(--text-muted)",
          fontSize: "0.9rem",
        }}
      >
        <div>
          <strong style={{ color: "var(--text)" }}>Reservia</strong> — Votre
          prochaine aventure commence ici.
        </div>
        <div>© {new Date().getFullYear()} Reservia. Projet pédagogique.</div>
      </div>
    </footer>
  );
}
