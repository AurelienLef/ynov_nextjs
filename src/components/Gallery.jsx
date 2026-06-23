"use client";

import { useState } from "react";

function Placeholder({ label, small }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: small ? 0 : 6,
        background: "var(--gradient-soft)",
        color: "var(--primary)",
      }}
    >
      <span style={{ fontSize: small ? "1.1rem" : "2rem" }}>🏞️</span>
      {!small && (
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {label || "Image indisponible"}
        </span>
      )}
    </div>
  );
}

export default function Gallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const list = (images || []).filter(Boolean);

  const [broken, setBroken] = useState({});
  const markBroken = (i) => setBroken((prev) => ({ ...prev, [i]: true }));

  if (list.length === 0) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 380,
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        <Placeholder label="Aucune image" />
      </div>
    );
  }

  return (
    <div>
      {/* Image principale */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 380,
          borderRadius: "var(--radius)",
          overflow: "hidden",
          marginBottom: 12,
          background: "var(--primary-light)",
        }}
      >
        {broken[active] ? (
          <Placeholder label={alt} />
        ) : (
          <img
            src={list[active]}
            alt={alt}
            onError={() => markBroken(active)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Miniatures */}
      {list.length > 1 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                position: "relative",
                width: 90,
                height: 64,
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                border:
                  i === active
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                padding: 0,
                cursor: "pointer",
                background: "var(--primary-light)",
              }}
            >
              {broken[i] ? (
                <Placeholder small />
              ) : (
                <img
                  src={img}
                  alt={`${alt} ${i + 1}`}
                  onError={() => markBroken(i)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
