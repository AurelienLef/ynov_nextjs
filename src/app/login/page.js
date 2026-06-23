"use client";


import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: 440,
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: 6 }}>
          Connexion
        </h1>
        <p className="text-muted mb-4">Ravi de vous revoir sur Reservia.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="vous@email.com"
          />
        </div>

        <div className="field">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        <button
          className="btn btn-block mt-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-muted mt-4" style={{ textAlign: "center", fontSize: "0.9rem" }}>
          Pas encore de compte ?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
