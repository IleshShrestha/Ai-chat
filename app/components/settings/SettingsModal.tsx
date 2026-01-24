'use client';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useTheme, type Theme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const themes: { id: Theme; name: string; preview: { primary: string; accent: string } }[] = [
	{
		id: 'light',
		name: 'Light',
		preview: {
			primary: '#f3f4f6',
			accent: '#9333ea',
		},
	},
	{
		id: 'dark',
		name: 'Dark',
		preview: {
			primary: '#0f172a',
			accent: '#9333ea',
		},
	},
	{
		id: 'green',
		name: 'Green',
		preview: {
			primary: '#1a2e1a',
			accent: '#22c55e',
		},
	},
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const { theme, setTheme } = useTheme();

	const handleThemeSelect = (selectedTheme: Theme) => {
		setTheme(selectedTheme);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					onKeyDown={handleKeyDown}
				>
					<motion.div
						className="bg-(--color-surface) rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-(--color-text-primary)">
								Settings
							</h3>
							<button
								onClick={onClose}
								className="text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						
						<div className="mb-4">
							<h4 className="text-sm font-medium text-(--color-text-secondary) mb-3">
								Theme
							</h4>
							<div className="grid grid-cols-2 gap-3">
								{themes.map((themeOption) => (
									<button
										key={themeOption.id}
										onClick={() => handleThemeSelect(themeOption.id)}
										className={`relative p-4 rounded-lg border-2 transition-all ${
											theme === themeOption.id
												? 'border-(--color-accent) bg-(--color-secondary)'
												: 'border-(--color-border) hover:border-(--color-tertiary) bg-(--color-primary)'
										}`}
									>
										<div className="flex items-center space-x-3">
											<div
												className="w-8 h-8 rounded-full border-2 border-(--color-border)"
												style={{
													background: `linear-gradient(135deg, ${themeOption.preview.primary} 0%, ${themeOption.preview.accent} 100%)`,
												}}
											/>
											<span className="text-sm font-medium text-(--color-text-primary)">
												{themeOption.name}
											</span>
										</div>
										{theme === themeOption.id && (
											<div className="absolute top-2 right-2">
												<div className="w-4 h-4 bg-(--color-accent) rounded-full flex items-center justify-center">
													<div className="w-2 h-2 bg-(--color-text-primary) rounded-full" />
												</div>
											</div>
										)}
									</button>
								))}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
