/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // L'admin peut coller une URL d'image de n'importe quelle source,
    // ou uploader un fichier (servi localement depuis /uploads).
    // On autorise donc tous les domaines distants.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
