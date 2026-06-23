import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Gallery from "@/components/Gallery";
import ReservationForm from "@/components/ReservationForm";

export const revalidate = 120; // ISR

export async function generateStaticParams() {
  const destinations = await prisma.destination.findMany({
    select: { id: true },
  });
  return destinations.map((d) => ({ id: d.id }));
}

async function getDestination(id) {
  return prisma.destination.findUnique({ where: { id } });
}

export default async function DestinationDetailPage({ params }) {
  const destination = await getDestination(params.id);

  if (!destination) {
    notFound();
  }

  const gallery = destination.gallery
    ? destination.gallery.split(",").filter(Boolean)
    : [destination.image];

  const fmt = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      {/* Fil d'ariane simple */}
      <div className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
        <a href="/destinations" style={{ color: "var(--primary)" }}>
          Destinations
        </a>{" "}
        / {destination.name}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 36,
          alignItems: "start",
        }}
        className="detail-grid"
      >
        {/* Colonne gauche : galerie + description */}
        <div>
          <Gallery images={gallery} alt={destination.name} />

          <div style={{ marginTop: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
                {destination.name}
              </h1>
              <span className="badge">{destination.country}</span>
            </div>

            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-muted)",
                marginBottom: 20,
              }}
            >
              {destination.shortDesc}
            </p>

            <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>
              À propos de ce séjour
            </h2>
            <p style={{ lineHeight: 1.8 }}>{destination.longDesc}</p>

            <h2 style={{ fontSize: "1.25rem", margin: "24px 0 10px" }}>
              Période disponible
            </h2>
            <span
              style={{
                display: "inline-block",
                padding: "8px 18px",
                background: "var(--gradient-soft)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "var(--primary-dark)",
              }}
            >
              Du {fmt(destination.availableFrom)} au{" "}
              {fmt(destination.availableTo)}
            </span>
          </div>
        </div>

        {/* Colonne droite : encart réservation */}
        <div style={{ position: "sticky", top: 90 }}>
          <ReservationForm destination={destination} />
        </div>
      </div>
    </div>
  );
}
