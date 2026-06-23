import Image from "next/image";
import Link from "next/link";

export default function DestinationCard({ destination }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", width: "100%", height: 190 }}>
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          padding: 18,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            {destination.name}
          </h3>
          <span className="badge">{destination.country}</span>
        </div>

        <p
          className="text-muted"
          style={{ fontSize: "0.9rem", flex: 1, marginBottom: 14 }}
        >
          {destination.shortDesc}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              à partir de
            </span>
            <div style={{ fontWeight: 800, fontSize: "1.15rem" }}>
              {destination.basePrice} €{" "}
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                / nuit
              </span>
            </div>
          </div>
          <Link
            href={`/destinations/${destination.id}`}
            className="btn"
            style={{ padding: "9px 18px" }}
          >
            Voir plus
          </Link>
        </div>
      </div>
    </div>
  );
}
