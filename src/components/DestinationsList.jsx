"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DestinationCard from "@/components/DestinationCard";

const PAGE_SIZE = 6;

export default function DestinationsList({ destinations }) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [sortPrice, setSortPrice] = useState("none"); // none | asc | desc
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const countries = useMemo(() => {
    const set = new Set(destinations.map((d) => d.country));
    return ["all", ...Array.from(set).sort()];
  }, [destinations]);

  const filtered = useMemo(() => {
    let result = [...destinations];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q)
      );
    }

    if (country !== "all") {
      result = result.filter((d) => d.country === country);
    }

    if (sortPrice === "asc") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortPrice === "desc") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    return result;
  }, [destinations, query, country, sortPrice]);

  useEffect(() => {
    setPage(1);
  }, [query, country, sortPrice]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Barre de filtres */}
      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 28,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: "2 1 240px" }}>
          <label
            style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: 6 }}
          >
            Recherche
          </label>
          <input
            type="text"
            placeholder="Nom ou pays…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 13px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
            }}
          />
        </div>

        <div style={{ flex: "1 1 160px" }}>
          <label
            style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: 6 }}
          >
            Pays
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 13px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: "#fff",
            }}
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Tous les pays" : c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1 1 160px" }}>
          <label
            style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: 6 }}
          >
            Prix
          </label>
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 13px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: "#fff",
            }}
          >
            <option value="none">Par défaut</option>
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>

      {/* Résultats */}
      <p className="text-muted" style={{ marginBottom: 18 }}>
        {filtered.length} destination{filtered.length > 1 ? "s" : ""} trouvée
        {filtered.length > 1 ? "s" : ""}
      </p>

      {paginated.length === 0 ? (
        <div className="empty-state">
          <p>Aucune destination ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid">
          {paginated.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 36,
          }}
        >
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Précédent
          </button>
          <span style={{ fontWeight: 600 }}>
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
