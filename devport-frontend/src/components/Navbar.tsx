import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/[.1]">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-gray-900 dark:text-white"
      >
        DevPort
      </Link>
      <Link
        href="/about"
        className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
      >
        About Us
      </Link>
    </nav>
  );
}