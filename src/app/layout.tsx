import "./globals.css";
import Navbar from "@/components/Navbar";
import Toaster from "@/components/Toaster";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fffafc] ">
        <Providers>
        <Navbar />
        <Toaster />

        <main className="mx-auto max-w-6xl px-4 py-8 ">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
