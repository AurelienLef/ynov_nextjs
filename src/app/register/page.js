"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription.");
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: 440, paddingTop: 60, paddingBottom: 60 }}
    >
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: 6 }}>
          Inscription
        </h1>
        <p className="text-muted mb-4">
          Créez votre compte pour réserver vos voyages.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label>Nom complet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="6 caractères minimum"
          />
        </div>

        <button
          className="btn btn-block mt-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p
          className="text-muted mt-4"
          style={{ textAlign: "center", fontSize: "0.9rem" }}
        >
          Déjà un compte ?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
