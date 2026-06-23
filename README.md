# 🌍 Reservia — Plateforme de réservation de voyages

Application web complète de réservation de voyages développée avec **Next.js 14 (App Router)**.
Les utilisateurs peuvent explorer des destinations, réserver un séjour et gérer leurs
réservations. Les administrateurs disposent d'une interface dédiée pour gérer le catalogue.

---

## 📑 Sommaire

1. [Stack technique](#-stack-technique)
2. [Installation](#-installation)
3. [Comptes de démonstration](#-comptes-de-démonstration)
4. [Choix de rendu : SSR / SSG / ISR (justification)](#-choix-de-rendu--ssr--ssg--isr-justification)
5. [Architecture du projet](#-architecture-du-projet)
6. [Base de données](#-base-de-données)
7. [API Routes](#-api-routes)
8. [Authentification & sécurité](#-authentification--sécurité)
9. [Optimisations](#-optimisations)

---

## 🛠 Stack technique

| Domaine          | Technologie                                  |
| ---------------- | -------------------------------------------- |
| Framework        | Next.js 14 (App Router)                      |
| Langage          | JavaScript / React 18                        |
| Base de données  | SQLite (par défaut) via **Prisma ORM**       |
| Authentification | **NextAuth.js** (Credentials + JWT)          |
| Hachage          | bcryptjs                                      |
| Styles           | CSS global + variables CSS (thème blanc/violet) |
| Images           | `next/image` + upload local (`/public/uploads`) |

> **Pourquoi SQLite ?** Zéro configuration : la base se crée dans un simple fichier,
> idéal pour lancer le projet immédiatement. Le passage à **PostgreSQL** ou **MySQL**
> ne demande que 2 lignes à modifier (voir [Base de données](#-base-de-données)).

---

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm

### Étapes

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier d'environnement
cp .env.example .env
# (Optionnel) générer un vrai secret :
#   openssl rand -base64 32
# puis le coller dans NEXTAUTH_SECRET

# 3. Créer la base de données (applique le schéma Prisma)
npm run db:push

# 4. Remplir la base avec des données de démo (6 destinations + 2 comptes)
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur **http://localhost:3000**.

### Scripts disponibles

| Commande            | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Lance le serveur de développement            |
| `npm run build`     | Build de production                          |
| `npm run start`     | Lance le serveur de production               |
| `npm run db:push`   | Applique le schéma Prisma à la base          |
| `npm run db:seed`   | Remplit la base avec les données de démo     |
| `npm run db:studio` | Ouvre Prisma Studio (visualiser les données) |

> ⚠️ **Note réseau** : Prisma télécharge un moteur natif depuis `binaries.prisma.sh`
> lors du `npm install`. Si vous êtes derrière un réseau restreint et obtenez une
> erreur 403, autorisez ce domaine ou définissez la variable
> `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`.

---

## 🔑 Comptes de démonstration

Après `npm run db:seed`, deux comptes sont disponibles :

| Rôle          | Email                | Mot de passe |
| ------------- | -------------------- | ------------ |
| Administrateur| `admin@reservia.com` | `admin123`   |
| Utilisateur   | `user@reservia.com`  | `user123`    |

Vous pouvez aussi créer un nouveau compte via la page **Inscription**.

> ℹ️ **Upload d'images en production** : les fichiers importés sont enregistrés dans
> `public/uploads/`. Cela fonctionne parfaitement **en local**. Sur un hébergeur dont le
> système de fichiers est en lecture seule (ex : Vercel), ce stockage local ne persiste
> pas : il faudrait alors brancher un service externe (Amazon S3, Cloudinary, UploadThing…).
> Coller une URL d'image fonctionne, elle, dans tous les cas.

---

## 🎯 Choix de rendu : SSR / SSG / ISR (justification)

C'est le cœur pédagogique du projet. Chaque page utilise la stratégie **la plus
pertinente** selon la nature de son contenu. Voici le raisonnement page par page.

### Rappel des 3 stratégies

- **SSG** (Static Site Generation) : page générée **une fois au build**. Ultra rapide,
  parfaite pour un contenu qui ne change pas. Inconvénient : nécessite un re-build pour
  mettre à jour.
- **SSR** (Server-Side Rendering) : page générée **à chaque requête** sur le serveur.
  Toujours fraîche et personnalisable, mais plus lente et plus coûteuse.
- **ISR** (Incremental Static Regeneration) : compromis idéal. La page est **statique**
  (rapide) mais **régénérée automatiquement** à intervalle régulier (`revalidate`).

### Tableau récapitulatif

| Page                       | Rendu choisi | Paramètre              | Justification courte                                                |
| -------------------------- | ------------ | ---------------------- | ------------------------------------------------------------------- |
| `/` (Accueil)              | **ISR**      | `revalidate = 3600`    | Contenu quasi statique mais destinations populaires peuvent évoluer |
| `/destinations`            | **ISR**      | `revalidate = 60`      | Catalogue qui change peu → statique rapide + mises à jour régulières|
| `/destinations/[id]`       | **ISR**      | `revalidate = 120` + `generateStaticParams` | Fiches pré-générées, régénérées si l'admin modifie une destination |
| `/login`, `/register`      | **CSR**      | `"use client"`         | Formulaires interactifs et propres à chaque visiteur                |
| `/account` (Mon compte)    | **CSR**      | `"use client"`         | Données **privées** par utilisateur → aucun cache, pas de SEO       |
| `/admin`                   | **CSR**      | `"use client"`         | Tableau de bord privé, ultra interactif, non indexable              |


---

## 🏗 Architecture du projet

```
reservia/
├── prisma/
│   ├── schema.prisma        # Schéma de la base (User, Destination, Reservation)
│   └── seed.js              # Données de démonstration
├── src/
│   ├── app/
│   │   ├── layout.js                    # Layout racine (Navbar, Footer, Provider)
│   │   ├── page.js                      # 🏠 Accueil (ISR)
│   │   ├── globals.css                  # Design system (variables CSS)
│   │   ├── loading.js                   # État de chargement global
│   │   ├── not-found.js                 # Page 404
│   │   ├── destinations/
│   │   │   ├── page.js                  # 📋 Liste (ISR)
│   │   │   └── [id]/page.js             # 🏝️ Détail (ISR + generateStaticParams)
│   │   ├── login/page.js                # 🔐 Connexion (CSR)
│   │   ├── register/page.js             # 🔐 Inscription (CSR)
│   │   ├── account/page.js              # 👤 Mon compte (CSR, protégé)
│   │   ├── admin/page.js                # ⚙️ Admin (CSR, protégé)
│   │   └── api/                         # 🔌 API Routes (backend)
│   │       ├── auth/[...nextauth]/route.js
│   │       ├── register/route.js
│   │       ├── destinations/route.js
│   │       ├── destinations/[id]/route.js
│   │       ├── reservations/route.js
│   │       ├── reservations/[id]/route.js
│   │       └── upload/route.js          # Upload d'images (admin)
│   ├── components/          # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── DestinationsList.jsx
│   │   ├── Gallery.jsx
│   │   ├── ReservationForm.jsx          # Réservation par plage de dates
│   │   ├── ImageInput.jsx               # Champ image (upload OU URL)
│   │   ├── GalleryInput.jsx             # Galerie multi-images (upload OU URL)
│   │   └── AuthProvider.jsx
│   ├── lib/                 # Logique métier / config
│   │   ├── prisma.js        # Singleton Prisma
│   │   └── auth.js          # Configuration NextAuth
│   ├── middleware.js        # Protection des routes (serveur)
│   └── ...
├── public/uploads/         # Images uploadées (servies statiquement)
├── .env.example
├── next.config.mjs
└── package.json
```

**Séparation des responsabilités :**
- `components/` → UI réutilisable (présentations).
- `lib/` → configuration et accès aux données (Prisma, auth).
- `app/api/` → logique backend (services).
- Découpage clair **Server Components** (données, SEO) vs **Client Components**
  (interactivité, `"use client"`).

---

## 🗄 Base de données

### Schéma (3 entités)

```
┌─────────────┐         ┌──────────────────┐         ┌───────────────┐
│    User     │         │   Reservation    │         │  Destination  │
├─────────────┤         ├──────────────────┤         ├───────────────┤
│ id (PK)     │────┐    │ id (PK)          │    ┌────│ id (PK)       │
│ name        │    │    │ startDate        │    │    │ name          │
│ email (uniq)│    └───<│ endDate          │    │    │ country       │
│ password    │         │ nights           │    │    │ image         │
│ role        │         │ people           │    │    │ gallery       │
│ createdAt   │         │ totalPrice       │    │    │ basePrice     │
└─────────────┘         │ userId (FK)      │    │    │ shortDesc     │
                        │ destinationId(FK)│>───┘    │ longDesc      │
                        │ createdAt        │         │ availableFrom │
                        └──────────────────┘         │ availableTo   │
   1 User ──< N Reservations                         │ createdAt     │
   1 Destination ──< N Reservations                  └───────────────┘
```

**À propos des dates** : chaque destination définit une **plage d'ouverture**
(`availableFrom` → `availableTo`). Lors de la réservation, le voyageur choisit ses
propres dates d'**arrivée** (`startDate`) et de **départ** (`endDate`) à l'intérieur de
cette plage. Le nombre de **nuits** est calculé automatiquement, et le prix total vaut
`basePrice × nights × people` (prix par nuit et par personne).

### Relations
- Un **User** possède plusieurs **Reservations** (1—N).
- Une **Destination** est liée à plusieurs **Reservations** (1—N).
- Suppression en cascade (`onDelete: Cascade`) : supprimer un user ou une destination
  supprime ses réservations associées.

### Changer de base de données (PostgreSQL / MySQL)

1. Dans `prisma/schema.prisma`, modifier le `provider` :
   ```prisma
   datasource db {
     provider = "postgresql"   // ou "mysql"
     url      = env("DATABASE_URL")
   }
   ```
2. Dans `.env`, mettre l'URL de connexion correspondante :
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/reservia"
   ```
3. Relancer `npm run db:push && npm run db:seed`.

> Note : avec PostgreSQL, le champ `gallery` (stocké en chaîne d'URLs séparées par des
> virgules pour SQLite) pourrait devenir un tableau natif `String[]`.

---

## 🔌 API Routes

Toutes les routes sont dans `src/app/api/` (backend intégré de Next.js).

| Méthode | Route                       | Accès        | Description                          |
| ------- | --------------------------- | ------------ | ------------------------------------ |
| POST    | `/api/register`             | Public       | Inscription d'un utilisateur         |
| *       | `/api/auth/[...nextauth]`   | Public       | Connexion / session (NextAuth)       |
| GET     | `/api/destinations`         | Public       | Liste des destinations               |
| POST    | `/api/destinations`         | **Admin**    | Créer une destination                |
| GET     | `/api/destinations/[id]`    | Public       | Détail d'une destination             |
| PUT     | `/api/destinations/[id]`    | **Admin**    | Modifier une destination             |
| DELETE  | `/api/destinations/[id]`    | **Admin**    | Supprimer une destination            |
| GET     | `/api/reservations`         | Connecté     | Mes réservations (ou toutes si admin)|
| POST    | `/api/reservations`         | Connecté     | Créer une réservation                |
| DELETE  | `/api/reservations/[id]`    | Propriétaire | Annuler une réservation              |
| POST    | `/api/upload`               | **Admin**    | Uploader une image (→ /public/uploads)|

Chaque route gère les **erreurs** (codes 400/401/403/404/500) et vérifie les
**autorisations** côté serveur via `getServerSession`.

---

## 🔐 Authentification & sécurité

- **NextAuth.js** avec le provider **Credentials** (email + mot de passe).
- Stratégie de session **JWT** (le rôle et l'id sont injectés dans le token).
- Mots de passe **hachés avec bcrypt** (jamais stockés en clair).
- **Double protection des routes privées** :
  1. Côté serveur via `src/middleware.js` (bloque l'accès à `/account` et `/admin`).
  2. Côté client via `useSession` (redirection si non autorisé).
- Les routes API sensibles vérifient le rôle **ADMIN** avant toute écriture.

---

## ⚡ Optimisations & fonctionnalités

- **Images** : `next/image` partout (lazy-loading, formats modernes, `sizes` adaptés,
  `priority` sur les images du hero).
- **Upload d'images** : l'admin peut **importer un fichier** depuis son ordinateur
  (enregistré dans `/public/uploads`) **ou coller une URL**. Aperçu en direct, validation
  du type et de la taille (5 Mo max).
- **Réservation par plage de dates** : sélection arrivée/départ avec calendriers natifs
  bornés à la période disponible, calcul automatique du nombre de nuits et du prix.
- **Thème** : design system blanc/violet via variables CSS, boutons en dégradé, accents
  colorés (rose, cyan, ambre).
- **Rendu** : ISR pour servir des pages statiques rapides tout en gardant les données à jour.
- **`useMemo`** pour le filtrage/tri des destinations et le calcul du prix sans recalcul inutile.
- **Loading states** : spinners et messages pendant le chargement des données.
- **Gestion d'erreurs** : try/catch côté API et messages clairs côté UI.
- **Responsive design** : media queries pour mobile/tablette (grilles adaptatives,
  navbar simplifiée).
- **Singleton Prisma** pour éviter la multiplication des connexions en développement.
