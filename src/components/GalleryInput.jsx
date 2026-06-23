"use client";

import { useState } from "react";

export default function GalleryInput({ value, onChange }) {
  const images = value ? value.split(",").filter(Boolean) : [];

  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  const update = (newImages) => onChange(newImages.join(","));

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
      update([...images, data.url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    update([...images, urlInput.trim()]);
    setUrlInput("");
  };

  const remove = (index) => {
    update(images.filter((_, i) => i !== index));
  };

  return (
    <div className="field">
      <label>Galerie d'images (plusieurs possibles)</label>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Ajout par upload */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <label
          className="btn btn-secondary"
          style={{ padding: "8px 14px", fontSize: "0.85rem", cursor: "pointer" }}
        >
          📤 Importer une image
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>

        {/* Ajout par URL */}
        <div style={{ display: "flex", gap: 6, flex: "1 1 240px" }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
            placeholder="…ou coller une URL puis Entrée"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: "8px 14px" }}
            onClick={addUrl}
          >
            +
          </button>
        </div>
      </div>

      {uploading && (
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Upload en cours…
        </p>
      )}

      {/* Aperçu des images de la galerie */}
      {images.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                alt={`Image ${i + 1}`}
                style={{
                  width: 84,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}
                onError={(e) => (e.currentTarget.style.opacity = "0.3")}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                title="Retirer"
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "none",
                  background: "var(--danger)",
                  color: "#fff",
                  fontSize: "0.8rem",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
