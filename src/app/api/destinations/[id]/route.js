// API : opérations sur une destination précise.
// GET    /api/destinations/[id]          -> détail
// PUT    /api/destinations/[id]  (ADMIN) -> modifier
// DELETE /api/destinations/[id]  (ADMIN) -> supprimer

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
    });
    if (!destination) {
      return NextResponse.json(
        { error: "Destination introuvable." },
        { status: 404 }
      );
    }
    return NextResponse.json(destination);
  } catch (err) {
    console.error("Erreur GET destination:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const body = await request.json();
    const data = { ...body };
    if (data.basePrice !== undefined) data.basePrice = Number(data.basePrice);

    const destination = await prisma.destination.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(destination);
  } catch (err) {
    console.error("Erreur PUT destination:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    await prisma.destination.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE destination:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
