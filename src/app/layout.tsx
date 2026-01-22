import "./globals.css";
import Navbar from "@/components/Navbar";
import Toaster from "@/components/Toaster";
import Providers from "@/components/Providers";
import ProductsSidebar from "@/components/NavDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fffafc]">
        <Providers>
          <Navbar />
          <Toaster />

          
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex gap-6">
              
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
