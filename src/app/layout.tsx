import "./globals.css";
import Navbar from "@/components/Navbar";
import Toaster from "@/components/Toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fffafc]">
        <Navbar />
        <Toaster />

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
