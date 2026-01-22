import "./globals.css";
import Navbar from "@/components/Navbar";
import Toaster from "@/components/Toaster";
import Providers from "@/components/Providers";
import { Suspense } from "react";

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div className="h-10 w-10 rounded-full border bg-white" />
        <div className="h-6 w-28 rounded bg-gray-200" />
        <div className="ml-auto h-10 w-56 rounded-full border bg-white" />
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fffafc]">
        <Providers>
        
          <Suspense fallback={<NavbarFallback />}>
            <Navbar />
          </Suspense>

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
