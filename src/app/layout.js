import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Reservia — Réservez votre prochain voyage",
  description:
    "Explorez des destinations de rêve et réservez votre séjour en quelques clics avec Reservia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 64px)" }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
