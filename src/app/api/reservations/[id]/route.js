// API : annulation d'une réservation.
// DELETE /api/reservations/[id]
// Un utilisateur ne peut annuler que SES réservations (un admin peut tout annuler).

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Réservation introuvable." },
        { status: 404 }
      );
    }

    // Vérification du propriétaire (sauf admin)
    if (
      reservation.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    await prisma.reservation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE reservation:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
