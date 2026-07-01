'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings, LogOut, Link2 } from 'lucide-react';
import SettingsModal from '../settings/SettingsModal';
import SignOutConfirmModal from './SignOutConfirmModal';
import { createClient } from '../../utils/supabase/client';

export default function SidebarFooter() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [email, setEmail] = useState<string | null>(null);
	const [linkError, setLinkError] = useState<string | null>(null);
	const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
	const signOutFormRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		const supabase = createClient();

		supabase.auth.getUser().then(({ data }) => {
			if (data.user?.is_anonymous) {
				setEmail('Guest');
			} else {
				setEmail(data.user?.email ?? null);
			}
		});
	}, []);

	// Surface an error handed back by /auth/callback (e.g. a failed account link,
	// which fails only after the Google round-trip). Then clean it from the URL.
	useEffect(() => {
		const authError = new URLSearchParams(window.location.search).get(
			'authError'
		);
		if (!authError) return;

		setLinkError(
			/already/i.test(authError)
				? 'That Google account is already in use. Please sign out and sign in with it instead.'
				: authError
		);

		const url = new URL(window.location.href);
		url.searchParams.delete('authError');
		window.history.replaceState(null, '', url.toString());
	}, []);

	const linkAccount = async () => {
		setLinkError(null);
		const supabase = createClient();
		const { error } = await supabase.auth.linkIdentity({
			provider: 'google',
			options: { redirectTo: `${window.location.origin}/auth/callback` },
		});
		// On success the browser redirects to Google, so we only reach here on error.
		if (!error) return;

		if (error.code === 'identity_already_exists') {
			setLinkError(
				'That Google account is already in use. Please sign out and sign in with it instead.'
			);
		} else if (error.code === 'manual_linking_disabled') {
			setLinkError('Account linking is not available right now.');
		} else {
			setLinkError(error.message);
		}
	};

	return (
		<>
			<motion.div
				className="flex flex-col gap-1"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>

				{email && (
					<p className="px-3 py-1 text-xs text-(--color-text-muted) truncate text-center">
						{email}
					</p>
				)}
				{email === 'Guest' && (
					<motion.button
						onClick={linkAccount}
						className="w-full flex items-center justify-center px-3 py-2 hover:bg-(--color-tertiary) rounded-lg transition-colors text-(--color-text-primary)"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<Link2 className="w-4 h-4 mr-2" />
						Link Account
					</motion.button>
				)}

				{linkError && (
					<p className="px-3 py-1 text-xs text-red-400 text-center">
						{linkError}
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

				<form ref={signOutFormRef} action="/auth/signout" method="post">
					<motion.button
						type="button"
						onClick={() => setShowSignOutConfirm(true)}
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

			<SignOutConfirmModal
				isOpen={showSignOutConfirm}
				isGuest={email === 'Guest'}
				onClose={() => setShowSignOutConfirm(false)}
				onConfirm={() => signOutFormRef.current?.requestSubmit()}
			/>
		</>
	);
}
