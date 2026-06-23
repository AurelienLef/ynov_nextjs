"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ReservationForm({ destination }) {
  const router = useRouter();
  const { status } = useSession();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minDate = destination.availableFrom;
  const maxDate = destination.availableTo;

  const nights = useMemo(() => {
    if (!startDate || !endDate || endDate <= startDate) return 0;
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.round((new Date(endDate) - new Date(startDate)) / MS_PER_DAY);
  }, [startDate, endDate]);

  const total = useMemo(
    () => destination.basePrice * nights * people,
    [destination.basePrice, nights, people]
  );

  const handleReserve = async () => {
    setError("");

    if (!startDate || !endDate) {
      setError("Veuillez choisir vos dates d'arrivée et de départ.");
      return;
    }
    if (nights <= 0) {
      setError("La date de départ doit être après la date d'arrivée.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: destination.id,
          startDate,
          endDate,
          people,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la réservation.");
      }

      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ marginBottom: 10, fontSize: "1.2rem" }}>Réserver</h3>
        <p className="text-muted mb-4">
          Vous devez être connecté pour réserver ce séjour.
        </p>
        <Link href="/login" className="btn btn-block">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 22 }}>
      <h3 style={{ marginBottom: 6, fontSize: "1.2rem" }}>
        Réserver ce séjour
      </h3>
      <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 16 }}>
        Disponible du{" "}
        {new Date(minDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
        })}{" "}
        au{" "}
        {new Date(maxDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Arrivée</label>
          <input
            type="date"
            value={startDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate && e.target.value >= endDate) setEndDate("");
            }}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Départ</label>
          <input
            type="date"
            value={endDate}
            min={startDate || minDate}
            max={maxDate}
            disabled={!startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Nombre de personnes</label>
        <select
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} personne{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {nights > 0 && (
        <div
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            padding: "10px 0",
          }}
        >
          {destination.basePrice} € × {nights} nuit{nights > 1 ? "s" : ""} ×{" "}
          {people} pers.
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 0",
          borderTop: "1px solid var(--border)",
        }}
      >
        <span style={{ fontWeight: 600 }}>Total</span>
        <span style={{ fontWeight: 800, fontSize: "1.4rem" }}>{total} €</span>
      </div>

      <button
        className="btn btn-block mt-2"
        onClick={handleReserve}
        disabled={loading || status === "loading" || nights <= 0}
      >
        {loading ? "Réservation en cours…" : "Confirmer la réservation"}
      </button>
    </div>
  );
}
