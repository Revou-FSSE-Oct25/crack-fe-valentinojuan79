import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Solvio — Property Stewardship",
  description: "Standar baru dalam pemeliharaan properti premium.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#FDFCFB] text-[#1A1410] antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
