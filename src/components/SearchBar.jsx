"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("q", destination);
    if (date) params.set("date", date);
    router.push(`/destinations?${params.toString()}`);
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--border)",
        padding: 16,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "flex-end",
        maxWidth: 720,
      }}
    >
      <div style={{ flex: "1 1 220px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.82rem",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Destination
        </label>
        <input
          type="text"
          placeholder="Où souhaitez-vous aller ?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      </div>

      <div style={{ flex: "1 1 160px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.82rem",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      </div>

      <button
        className="btn"
        style={{ flex: "0 0 auto", padding: "12px 28px" }}
        onClick={handleSearch}
      >
        Rechercher
      </button>
    </div>
  );
}
