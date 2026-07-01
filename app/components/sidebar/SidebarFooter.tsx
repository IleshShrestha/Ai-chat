'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, LogOut } from 'lucide-react';
import SettingsModal from '../settings/SettingsModal';
import { createClient } from '../../utils/supabase/client';

export default function SidebarFooter() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const supabase = createClient();
		supabase.auth
			.getUser()
			.then(({ data }) => setEmail(data.user?.email ?? null));
	}, []);

	return (
		<>
			<motion.div
				className="flex flex-col gap-1"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				{email && (
					<p className="px-3 py-1 text-xs text-(--color-text-muted) truncate">
						{email}
					</p>
				)}

				<motion.button
					onClick={() => setIsModalOpen(true)}
					className="w-full flex items-center justify-center px-3 py-2 hover:bg-(--color-tertiary) rounded-lg transition-colors text-(--color-text-primary)"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<Settings className="w-4 h-4 mr-2" />
					Settings
				</motion.button>

				<form action="/auth/signout" method="post">
					<motion.button
						type="submit"
						className="w-full flex items-center justify-center px-3 py-2 hover:bg-(--color-tertiary) rounded-lg transition-colors text-(--color-text-primary)"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<LogOut className="w-4 h-4 mr-2" />
						Sign out
					</motion.button>
				</form>
			</motion.div>

			<SettingsModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
