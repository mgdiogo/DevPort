import { useState } from 'react';

interface PasswordRequirementsProps {
	password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
	const [visible, setVisible] = useState(false);

	const rules = [
		{ label: 'At least 6 characters', valid: password.length >= 6 },
		{ label: 'One lowercase letter', valid: /[a-z]/.test(password) },
		{ label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
		{ label: 'One number', valid: /\d/.test(password) },
		{ label: 'One special character', valid: /[^A-Za-z0-9]/.test(password) },
	];

	return (
		<div className="absolute right-0 mt-[14px]">
			<button
				type="button"
				onClick={() => setVisible(!visible)}
				className="bg-gray-800 dark:bg-white text-white dark:text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm transition-colors hover:bg-gray-700 dark:hover:bg-gray-300"
				title="Show password rules"
			>
				?
			</button>

			{visible && (
				<div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-10 w-64 bg-white dark:bg-black border border-gray-300 dark:border-white/[.1] p-4 rounded-xl shadow-lg transition-all duration-200 ease-out animate-fade-in text-left">
					<strong className="block mb-2">Password requirements:</strong>
					<ul className="list-disc list-inside space-y-1 text-sm">
						{rules.map((rule, idx) => (
							<li
								key={idx}
								className={rule.valid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}
							>
								{rule.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
