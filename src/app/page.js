import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import DestinationCard from "@/components/DestinationCard";

export const revalidate = 3600;

async function getPopularDestinations() {
  return prisma.destination.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
  });
}

export default async function HomePage() {
  const popular = await getPopularDestinations();
  const destinationCount = await prisma.destination.count();

  return (
    <div>
      <section className="container" style={{ paddingTop: 72, paddingBottom: 8 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 48,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: 999,
                background: "var(--primary-light)",
                color: "var(--primary-dark)",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              ✈️ Voyagez autrement avec Reservia
            </span>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                marginBottom: 22,
              }}
            >
              Votre prochaine{" "}
              <span
                style={{
                  background: "var(--gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                aventure
              </span>{" "}
              commence ici
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--text-muted)",
                maxWidth: 460,
                marginBottom: 36,
              }}
            >
              Explorez des destinations de rêve et réservez votre séjour en
              quelques clics, sans frais cachés.
            </p>

            <SearchBar />
          </div>

          <div
            style={{
              position: "relative",
              height: 440,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
            }}
            className="hero-image"
          >
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
              alt="Plage paradisiaque"
              fill
              priority
              sizes="(max-width: 880px) 100vw, 500px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 56 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            padding: "32px 24px",
            background: "var(--gradient-soft)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
          }}
        >
          {[
            { value: `${destinationCount}+`, label: "Destinations" },
            { value: "12k+", label: "Voyageurs conquis" },
            { value: "6+", label: "Pays couverts" },
            { value: "4.8/5", label: "Note moyenne" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  background: "var(--gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingTop: 56 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
          }}
        >
          <div>
            <h2 className="section-title">Destinations populaires</h2>
            <p className="text-muted" style={{ margin: 0 }}>
              Les coups de cœur des voyageurs Reservia.
            </p>
          </div>
          <Link href="/destinations" className="btn btn-secondary">
            Tout voir →
          </Link>
        </div>

        <div className="grid">
          {popular.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingTop: 64 }}>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {[
            {
              title: "Réservation simple",
              text: "Réservez en quelques clics, sans frais cachés.",
              color: "var(--primary)",
              bg: "var(--primary-light)",
              icon: "⚡",
            },
            {
              title: "Destinations vérifiées",
              text: "Une sélection de séjours de qualité partout dans le monde.",
              color: "var(--accent)",
              bg: "var(--accent-light)",
              icon: "✓",
            },
            {
              title: "Gestion facile",
              text: "Retrouvez et gérez toutes vos réservations au même endroit.",
              color: "var(--accent-3)",
              bg: "#cffafe",
              icon: "★",
            },
          ].map((item) => (
            <div key={item.title} className="card" style={{ padding: 24 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: item.bg,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  marginBottom: 14,
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: 8,
                  color: item.color,
                }}
              >
                {item.title}
              </h3>
              <p className="text-muted" style={{ margin: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
