import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="min-h-screen flex flex-col items-center justify-center px-4">
				<h1 className={`${geistSans.className} text-4xl font-bold mb-2`}>DevPort</h1>
				<p className={`${geistMono.className} text-lg text-gray-600 mb-6 text-center max-w-md`}>
					Track your projects, API keys, and usage with a developer-friendly dashboard.
				</p>
				<div className="flex gap-4">
					<Link href="/register" className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
						Sign Up
					</Link>
					<Link href="/login" className="px-6 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
						Sign In
					</Link>
				</div>
			</main>
		</>
	);
}
