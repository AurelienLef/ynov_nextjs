"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageInput from "@/components/ImageInput";
import GalleryInput from "@/components/GalleryInput";

const EMPTY_FORM = {
  name: "",
  country: "",
  image: "",
  gallery: "",
  basePrice: "",
  shortDesc: "",
  longDesc: "",
  availableFrom: "",
  availableTo: "",
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState("destinations");
  const [destinations, setDestinations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  const loadData = async () => {
    try {
      const [dRes, rRes] = await Promise.all([
        fetch("/api/destinations"),
        fetch("/api/reservations?all=true"),
      ]);
      if (dRes.ok) setDestinations(await dRes.json());
      if (rRes.ok) setReservations(await rRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      loadData();
    }
  }, [session]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setMessage("");
    if (!form.name || !form.country || !form.image || !form.basePrice) {
      setMessage("Nom, pays, image et prix sont obligatoires.");
      return;
    }

    if (!form.availableFrom || !form.availableTo) {
      setMessage("Veuillez définir la plage de disponibilité (dates).");
      return;
    }

    if (form.availableTo < form.availableFrom) {
      setMessage("La date de fin doit être après la date de début.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/destinations/${editingId}`
        : "/api/destinations";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur.");
      }

      setMessage(editingId ? "Destination modifiée ✓" : "Destination ajoutée ✓");
      resetForm();
      await loadData();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (d) => {
    setForm({
      name: d.name,
      country: d.country,
      image: d.image,
      gallery: d.gallery,
      basePrice: String(d.basePrice),
      shortDesc: d.shortDesc,
      longDesc: d.longDesc,
      availableFrom: d.availableFrom,
      availableTo: d.availableTo,
    });
    setEditingId(d.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer définitivement cette destination ?")) return;
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="spinner" />
        <p className="loading-text">Chargement du tableau de bord…</p>
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h1 className="section-title">Administration</h1>
      <p className="section-subtitle">
        Gérez les destinations et consultez les réservations.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <button
          className={tab === "destinations" ? "btn" : "btn btn-secondary"}
          onClick={() => setTab("destinations")}
        >
          Destinations ({destinations.length})
        </button>
        <button
          className={tab === "reservations" ? "btn" : "btn btn-secondary"}
          onClick={() => setTab("reservations")}
        >
          Réservations ({reservations.length})
        </button>
      </div>

      {tab === "destinations" && (
        <div>
          {/* Formulaire ajout / édition */}
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              {editingId ? "Modifier la destination" : "Ajouter une destination"}
            </h2>

            {message && (
              <div
                className={
                  message.includes("✓") ? "alert alert-success" : "alert alert-error"
                }
              >
                {message}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div className="field">
                <label>Nom *</label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Santorin"
                />
              </div>
              <div className="field">
                <label>Pays *</label>
                <input
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Grèce"
                />
              </div>
              <div className="field">
                <label>Prix par nuit / personne (€) *</label>
                <input
                  type="number"
                  value={form.basePrice}
                  onChange={(e) => handleChange("basePrice", e.target.value)}
                  placeholder="120"
                />
              </div>
            </div>

            <ImageInput
              label="Image principale *"
              value={form.image}
              onChange={(url) => handleChange("image", url)}
            />

            <GalleryInput
              value={form.gallery}
              onChange={(val) => handleChange("gallery", val)}
            />

            {/* Plage d'ouverture : le voyageur réservera ses dates dedans */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div className="field">
                <label>Disponible à partir du *</label>
                <input
                  type="date"
                  value={form.availableFrom}
                  onChange={(e) =>
                    handleChange("availableFrom", e.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>Disponible jusqu'au *</label>
                <input
                  type="date"
                  value={form.availableTo}
                  min={form.availableFrom || undefined}
                  onChange={(e) => handleChange("availableTo", e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Description courte</label>
              <input
                value={form.shortDesc}
                onChange={(e) => handleChange("shortDesc", e.target.value)}
                placeholder="Maisons blanches et couchers de soleil."
              />
            </div>

            <div className="field">
              <label>Description complète</label>
              <textarea
                rows={4}
                value={form.longDesc}
                onChange={(e) => handleChange("longDesc", e.target.value)}
                placeholder="Description détaillée du séjour…"
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={handleSubmit} disabled={saving}>
                {saving
                  ? "Enregistrement…"
                  : editingId
                  ? "Enregistrer les modifications"
                  : "Ajouter la destination"}
              </button>
              {editingId && (
                <button className="btn btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
          </div>

          {/* Liste des destinations */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {destinations.map((d) => (
              <div
                key={d.id}
                className="card"
                style={{
                  padding: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <strong>{d.name}</strong>{" "}
                  <span className="text-muted">— {d.country}</span>
                  <div className="text-muted" style={{ fontSize: "0.88rem" }}>
                    {d.basePrice} € / nuit / personne
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                    Dispo : {formatDate(d.availableFrom)} →{" "}
                    {formatDate(d.availableTo)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "8px 14px" }}
                    onClick={() => handleEdit(d)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: "8px 14px" }}
                    onClick={() => handleDelete(d.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reservations" && (
        <div>
          {reservations.length === 0 ? (
            <div className="empty-state">
              <p>Aucune réservation pour le moment.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="card"
                  style={{
                    padding: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <strong>{r.destination?.name}</strong>
                    <div className="text-muted" style={{ fontSize: "0.88rem" }}>
                      Client : {r.user?.name} ({r.user?.email})
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.88rem" }}>
                      {formatDate(r.startDate)} → {formatDate(r.endDate)} ·{" "}
                      {r.nights} nuit{r.nights > 1 ? "s" : ""} · {r.people}{" "}
                      pers.
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                    {r.totalPrice} €
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
