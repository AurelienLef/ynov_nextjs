const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const destinations = [
  {
    name: "Santorin",
    country: "Grèce",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&q=80",
      "https://images.unsplash.com/photo-1469796466635-455ede028aca?w=800&q=80",
    ].join(","),
    basePrice: 890,
    shortDesc: "Maisons blanches et couchers de soleil sur la mer Égée.",
    longDesc:
      "Santorin est une île volcanique des Cyclades célèbre pour ses villages aux maisons blanches et bleues accrochés aux falaises. Profitez des couchers de soleil légendaires d'Oia, des plages de sable noir et de la gastronomie grecque locale. Un séjour idéal pour les amateurs de paysages spectaculaires et de farniente.",
    availableFrom: "2026-07-01",
    availableTo: "2026-09-30",
  },
  {
    name: "Kyoto",
    country: "Japon",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    ].join(","),
    basePrice: 1490,
    shortDesc: "Temples millénaires et jardins zen au cœur du Japon.",
    longDesc:
      "Ancienne capitale impériale, Kyoto rassemble plus de 1600 temples bouddhistes et sanctuaires shinto. Déambulez dans le quartier de Gion, admirez le Pavillon d'Or, perdez-vous dans la bambouseraie d'Arashiyama et vivez une cérémonie du thé traditionnelle. La destination parfaite pour s'immerger dans la culture japonaise.",
    availableFrom: "2026-09-01",
    availableTo: "2026-11-30",
  },
  {
    name: "Marrakech",
    country: "Maroc",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    ].join(","),
    basePrice: 650,
    shortDesc: "Souks colorés, riads et portes du désert.",
    longDesc:
      "Marrakech, la ville rouge, séduit par ses souks animés, ses palais somptueux et ses jardins luxuriants comme le Jardin Majorelle. Place Jemaa el-Fna, riads traditionnels, cuisine épicée et excursions vers les dunes : un dépaysement total aux portes de l'Europe.",
    availableFrom: "2026-07-01",
    availableTo: "2026-12-15",
  },
  {
    name: "Bali",
    country: "Indonésie",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80",
    ].join(","),
    basePrice: 1150,
    shortDesc: "Rizières en terrasses, temples et plages paradisiaques.",
    longDesc:
      "Bali, l'île des dieux, mêle spiritualité, nature luxuriante et plages de rêve. Visitez les rizières de Tegalalang, les temples d'Uluwatu et d'Ubud, surfez sur les vagues de Canggu ou détendez-vous dans un spa balinais. Une destination complète entre culture et détente.",
    availableFrom: "2026-08-01",
    availableTo: "2026-10-31",
  },
  {
    name: "Cirque fer à cheval",
    country: "France",
    image:
      "https://static.affluences.media/sites-pictures/sites/jzJMC1x19.jpeg",
    gallery: [
      "https://static.affluences.media/sites-pictures/sites/jzJMC1x19.jpeg",
      "https://www.trace-ta-route.com/wp-content/uploads/2025/04/Haut-Giffre-Sixt-Fer-a-Cheval-Automne-Bout-du-Monde-0-Blog-Randonnee-Trace-Ta-Route-6-1200x800.jpg",
      "https://www.francecomfort.com/l/fr/library/download/urn:uuid:30a8b1c6-8e74-4a11-bf69-ecad39b4353e/sixt+fer+a+cheval+8+cascade+rouget+haute+savoie+cirque+sixt+passy+natuur+vakantie+abondance+luxe.jpg?color=ffffff&scaleType=2&width=1600&height=1000",
    ].join(","),
    basePrice: 250,
    shortDesc: "Le plus grand Cirque montagneux alpin.",
    longDesc:
      "Le Cirque du Fer-à-Cheval est le plus grand cirque montagneux des Alpes. Formant un demi-cercle parfait de falaises calcaires, il s'étend sur 4 à 5 km avec des parois verticales de 500 à 700 m de hauteur (jusqu'à 2000 m de dénivelé total).",
    availableFrom: "2026-05-01",
    availableTo: "2026-11-30",
  },
  {
    name: "El Calafate",
    country: "Patagonie",
    image:
      "https://images.ctfassets.net/bth3mlrehms2/7i4dH96saxVNRlNiBL5s0C/9c8840d899cc041780ee49f622740e58/El_Calafate__Santa_Cruz__Argentinien_.jpg",
    gallery: [
      "https://images.ctfassets.net/bth3mlrehms2/7i4dH96saxVNRlNiBL5s0C/9c8840d899cc041780ee49f622740e58/El_Calafate__Santa_Cruz__Argentinien_.jpg",
      "https://necvlggenujydiokngfg.supabase.co/storage/v1/object/public/nomadays-images/photos/8faaee73-8bc2-4a20-a04c-f1694f5a7a9d/content/b62253ab-f39e-4bf5-ae83-4607f55cd10d/81f87956-a596-4ad5-8f93-5846e7d36e1d.jpg",
      "https://torres-del-paine.org/wp-content/uploads/2019/02/elchalten4.jpg",
    ].join(","),
    basePrice: 500,
    shortDesc: "El Calafate est une ville située à proximité du champ de glace sud de la Patagonie.",
    longDesc:
      "El Calafate est une ville située à proximité du champ de glace sud de la Patagonie, dans la province argentine de Santa Cruz.",
    availableFrom: "2026-04-01",
    availableTo: "2026-10-01",
  },
  {
    name: "Dolomites",
    country: "Italie",
    image:
      "https://waitandsea.fr/wp-content/uploads/2018/08/dolomites-santa-magdalena-9-e1534790023816.jpg",
    gallery: [
      "https://waitandsea.fr/wp-content/uploads/2018/08/dolomites-santa-magdalena-9-e1534790023816.jpg",
      "https://www.terdav.com/Content/img/mag/vignettes/grande/1477.jpg",
      "https://photos.altai-travel.com/1920x1040/randonnee-dans-les-dolomites-en-italie-davolio-aurore-9211.jpg",
    ].join(","),
    basePrice: 420,
    shortDesc: "Massif montagneux des Préalpes orientales méridionales.",
    longDesc:
      "Territoire aux limites imprécises, les Dolomites correspondent à un ensemble alpin. Culminant à 3 343 mètres à la Marmolada, ce massif se caractérise par l'abondance de la dolomie, roche sédimentaire carbonatée auquel leur nom actuel est associé.",
    availableFrom: "2026-04-01",
    availableTo: "2026-10-01",
  },
];

async function main() {
  console.log("🌱 Seeding…");

  await prisma.reservation.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  await prisma.user.create({
    data: {
      name: "Admin Reservia",
      email: "admin@reservia.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jean Voyageur",
      email: "user@reservia.com",
      password: userPassword,
      role: "USER",
    },
  });

  for (const d of destinations) {
    await prisma.destination.create({ data: d });
  }

  console.log(`✅ ${destinations.length} destinations créées`);
  console.log("✅ 2 comptes créés :");
  console.log("   admin@reservia.com / admin123 (ADMIN)");
  console.log("   user@reservia.com  / user123  (USER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
