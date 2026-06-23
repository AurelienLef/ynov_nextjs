import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import DestinationsList from "@/components/DestinationsList";

export const revalidate = 60;

async function getDestinations() {
  return prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <h1 className="section-title">Toutes nos destinations</h1>
      <p className="section-subtitle">
        Trouvez le séjour qui vous correspond parmi notre sélection.
      </p>

      <Suspense fallback={<div className="spinner" />}>
        <DestinationsList destinations={destinations} />
      </Suspense>
    </div>
  );
}
