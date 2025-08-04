import { useState } from 'react';
import PasswordRequirements from './PasswordRequirements';

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SignUpForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg('');
		setSuccessMsg('');

		if (!email || !password) {
			setErrorMsg('Email and password are required.');
			return;
		}

		try {
			const response = await fetch(`${backend}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok)
				setErrorMsg(data.message);
			else {
				setSuccessMsg(data.message);
				setEmail('');
				setPassword('');
			}
		} catch (err) {
			setErrorMsg('Server error. Please try again later.');
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/[.1] p-6 sm:p-8 rounded-2xl shadow space-y-4 transition-colors"
		>
			<h2 className="text-2xl font-semibold tracking-tight text-center text-gray-900 dark:text-white">
				Create an Account
			</h2>

			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/[.1] bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
				required
			/>

			<div className="relative w-full">
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/[.1] bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<PasswordRequirements password={password} />
			</div>

			<div className="h-5 text-sm text-center">
				{errorMsg && <p className="text-red-500">{errorMsg}</p>}
				{successMsg && <p className="text-green-500">{successMsg}</p>}
			</div>

			<button
				type="submit"
				className="w-1/2 block mx-auto h-10 sm:h-12 px-4 sm:px-5 rounded-full border border-solid border-transparent transition-colors bg-black text-white hover:bg-[#383838] dark:bg-white dark:text-black dark:hover:bg-gray-300 font-medium text-sm sm:text-base"
			>
				Sign Up
			</button>
		</form>
	);
}