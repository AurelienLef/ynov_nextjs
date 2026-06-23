"use client";

import { useState } from "react";

export default function ImageInput({ value, onChange, label = "Image" }) {
  const [mode, setMode] = useState("upload"); // "upload" | "url"
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'upload.");

      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="field">
      <label>{label}</label>

      {/* Sélecteur de mode */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          className={mode === "upload" ? "btn" : "btn btn-secondary"}
          style={{ padding: "7px 14px", fontSize: "0.85rem" }}
          onClick={() => setMode("upload")}
        >
          📤 Importer un fichier
        </button>
        <button
          type="button"
          className={mode === "url" ? "btn" : "btn btn-secondary"}
          style={{ padding: "7px 14px", fontSize: "0.85rem" }}
          onClick={() => setMode("url")}
        >
          🔗 Coller une URL
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {mode === "upload" ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://exemple.com/image.jpg"
        />
      )}

      {uploading && (
        <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: 6 }}>
          Upload en cours…
        </p>
      )}

      {/* Aperçu */}
      {value && !uploading && (
        <div style={{ marginTop: 10 }}>
          <img
            src={value}
            alt="Aperçu"
            style={{
              maxWidth: 180,
              maxHeight: 120,
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
