// API : liste et création de réservations.
// GET  /api/reservations  -> réservations de l'utilisateur connecté
//                            (ou TOUTES si admin via ?all=true)
// POST /api/reservations  -> créer une réservation (connecté)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // Un admin peut demander toutes les réservations
    if (all && session.user.role === "ADMIN") {
      const reservations = await prisma.reservation.findMany({
        include: { destination: true, user: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reservations);
    }

    // Sinon : uniquement les siennes
    const reservations = await prisma.reservation.findMany({
      where: { userId: session.user.id },
      include: { destination: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reservations);
  } catch (err) {
    console.error("Erreur GET reservations:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour réserver." },
        { status: 401 }
      );
    }

    const { destinationId, startDate, endDate, people } =
      await request.json();

    if (!destinationId || !startDate || !endDate || !people) {
      return NextResponse.json(
        {
          error:
            "Destination, dates d'arrivée et de départ, et nombre de personnes requis.",
        },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });
    if (!destination) {
      return NextResponse.json(
        { error: "Destination introuvable." },
        { status: 404 }
      );
    }

    // --- Validation des dates ---
    // Le départ doit être après l'arrivée
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "La date de départ doit être après la date d'arrivée." },
        { status: 400 }
      );
    }

    // Les dates doivent rester dans la plage d'ouverture de la destination
    if (
      startDate < destination.availableFrom ||
      endDate > destination.availableTo
    ) {
      return NextResponse.json(
        {
          error: "Les dates choisies sont hors de la période disponible.",
        },
        { status: 400 }
      );
    }

    // --- Calcul du nombre de nuits ---
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const nights = Math.round(
      (new Date(endDate) - new Date(startDate)) / MS_PER_DAY
    );

    const nbPeople = Number(people);
    const totalPrice = destination.basePrice * nights * nbPeople;

    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        destinationId,
        startDate,
        endDate,
        nights,
        people: nbPeople,
        totalPrice,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error("Erreur POST reservation:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
