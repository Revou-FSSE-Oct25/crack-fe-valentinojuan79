import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "Solvio — Servis Rumah Profesional",
  description: "Hubungkan dengan teknisi rumahan terpercaya, cepat, dan transparan.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#FDFCFB] text-[#1A1410] antialiased">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
