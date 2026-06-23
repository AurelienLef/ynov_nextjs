"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      try {
        const res = await fetch("/api/reservations");
        if (res.ok) {
          setReservations(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const handleCancel = async (id) => {
    if (!confirm("Annuler cette réservation ?")) return;
    setCancelingId(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelingId(null);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="spinner" />
        <p className="loading-text">Chargement de votre espace…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h1 className="section-title">Mon compte</h1>
      <p className="section-subtitle">Bonjour {session.user.name} 👋</p>

      <div
        className="card"
        style={{ padding: 24, marginBottom: 32, maxWidth: 460 }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: 14 }}>
          Mes informations
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="text-muted">Nom</span>
            <strong>{session.user.name}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="text-muted">Email</span>
            <strong>{session.user.email}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="text-muted">Statut</span>
            <span className="badge">
              {session.user.role === "ADMIN" ? "Administrateur" : "Membre"}
            </span>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 18 }}>
        Mes réservations
      </h2>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p style={{ marginBottom: 16 }}>
            Vous n'avez pas encore de réservation.
          </p>
          <Link href="/destinations" className="btn">
            Découvrir les destinations
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reservations.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{
                padding: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  {r.destination?.name}
                </h3>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {r.destination?.country}
                </p>
                <p
                  className="text-muted"
                  style={{ fontSize: "0.9rem", marginTop: 2 }}
                >
                  {new Date(r.startDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  →{" "}
                  {new Date(r.endDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {r.nights} nuit{r.nights > 1 ? "s" : ""} · {r.people}{" "}
                  personne{r.people > 1 ? "s" : ""}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: "1.2rem" }}>
                  {r.totalPrice} €
                </span>
                <button
                  className="btn btn-danger"
                  style={{ padding: "8px 16px" }}
                  onClick={() => handleCancel(r.id)}
                  disabled={cancelingId === r.id}
                >
                  {cancelingId === r.id ? "Annulation…" : "Annuler"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
