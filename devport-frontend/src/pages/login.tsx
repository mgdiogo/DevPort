import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import { Geist } from "next/font/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export default function Login() {
	return (
		<>
			<Navbar />
			<main className="min-h-screen flex items-start justify-center px-4 pt-24 sm:pt-32">
				<div className="w-full max-w-xl space-y-6">
					<h1 className={`${geistSans.className} text-4xl font-bold text-center text-gray-900 dark:text-white`}>
						Welcome back
					</h1>
					<LoginForm />
				</div>
			</main>
		</>
	);
}