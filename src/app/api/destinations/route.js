// API : liste et création de destinations.
// GET  /api/destinations          -> toutes les destinations
// POST /api/destinations  (ADMIN) -> créer une destination

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(destinations);
  } catch (err) {
    console.error("Erreur GET destinations:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Seul un admin peut créer
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      country,
      image,
      gallery,
      basePrice,
      shortDesc,
      longDesc,
      availableFrom,
      availableTo,
    } = body;

    if (!name || !country || !image || !basePrice) {
      return NextResponse.json(
        { error: "Nom, pays, image et prix sont obligatoires." },
        { status: 400 }
      );
    }

    if (!availableFrom || !availableTo) {
      return NextResponse.json(
        { error: "La plage de disponibilité est obligatoire." },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        country,
        image,
        gallery: gallery || image,
        basePrice: Number(basePrice),
        shortDesc: shortDesc || "",
        longDesc: longDesc || "",
        availableFrom,
        availableTo,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (err) {
    console.error("Erreur POST destination:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
