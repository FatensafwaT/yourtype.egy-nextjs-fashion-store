import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          YourType<span className="text-pink-400">.egy</span>
        </Link>

        {/* Search */}
        <div className="flex-1">
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2">
            <span className="text-gray-400">⌕</span>
            <input
              placeholder="Search cute items..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-3">
          <Link
            href="/cart"
            className="rounded-full border bg-white px-3 py-2 text-sm hover:bg-pink-50"
          >
            🛒 Cart
          </Link>
          <Link
            href="/account"
            className="rounded-full border bg-white px-3 py-2 text-sm hover:bg-pink-50"
          >
            👤 Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
