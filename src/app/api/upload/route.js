// API : upload d'une image (réservé aux admins).
// POST /api/upload  (multipart/form-data, champ "file")
// Enregistre le fichier dans public/uploads/ et renvoie son URL publique.
//
// ⚠️ Stockage LOCAL : fonctionne en développement. Sur un hébergeur au
// système de fichiers en lecture seule (ex : Vercel), il faudrait un
// service externe (S3, Cloudinary…). Voir README.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Types d'images autorisés
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function POST(request) {
  try {
    // Seul un admin peut uploader
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté (JPEG, PNG, WebP ou GIF)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (5 Mo maximum)." },
        { status: 400 }
      );
    }

    // Conversion en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nom de fichier unique
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    // S'assurer que le dossier existe
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Écriture
    await writeFile(path.join(uploadDir, filename), buffer);

    // URL publique (servie depuis /public)
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("Erreur upload:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'upload." },
      { status: 500 }
    );
  }
}
