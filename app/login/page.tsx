'use client';
import { useRef, useState } from 'react';
import Script from 'next/script';
import { UserRound } from 'lucide-react';
import { createClient } from '../utils/supabase/client';

// Minimal typing for the Cloudflare Turnstile global.
declare global {
	interface Window {
		turnstile?: {
			render: (
				el: HTMLElement,
				opts: Record<string, unknown>
			) => string;
			reset: (widgetId?: string) => void;
		};
	}
}

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [guestLoading, setGuestLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showCaptcha, setShowCaptcha] = useState(false);

	const readyRef = useRef(false); // Turnstile script loaded?
	const widgetRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	const signInWithGoogle = async () => {
		setLoading(true);
		setError(null);
		const supabase = createClient();
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		if (error) {
			setError(error.message);
			setLoading(false);
		}
		// On success the browser is redirected to Google, so no further work here.
	};

	// Runs once Turnstile hands us a token — completes the anonymous sign-in.
	const completeGuestSignIn = async (captchaToken: string) => {
		const supabase = createClient();
		const { error } = await supabase.auth.signInAnonymously({
			options: { captchaToken },
		});
		if (!error) {
			window.location.assign('/chat');
			return;
		}
		// Tokens are single-use — reset so a retry gets a fresh one.
		setError(error.message);
		setGuestLoading(false);
		if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
	};

	// Clicking "Continue as Guest" reveals the captcha; solving it signs in.
	const startGuestSignIn = () => {
		setError(null);
		if (!readyRef.current || !window.turnstile || !widgetRef.current) {
			setError('Captcha is still loading — please try again in a moment.');
			return;
		}
		setGuestLoading(true);
		setShowCaptcha(true);

		if (widgetIdRef.current === null) {
			widgetIdRef.current = window.turnstile.render(widgetRef.current, {
				sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
				callback: (token: string) => completeGuestSignIn(token),
				'expired-callback': () => {
					setGuestLoading(false);
					setError('Captcha expired — please try again.');
				},
				'error-callback': () => {
					setGuestLoading(false);
					setError('Captcha failed to load — please try again.');
				},
			});
		} else {
			// Widget already exists from a previous attempt — just re-run it.
			window.turnstile.reset(widgetIdRef.current);
		}
	};

	return (
		<>
			<Script
				src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
				strategy="afterInteractive"
				onReady={() => {
					readyRef.current = true;
				}}
			/>

			<div className="flex flex-col items-center justify-center h-screen bg-(--color-background) text-(--color-text-primary) gap-6">
				<div className="text-center">
					<h1 className="text-3xl font-semibold mb-2">Spark</h1>
					<p className="text-(--color-text-muted)">Sign in to continue</p>
				</div>

				<button
					onClick={signInWithGoogle}
					disabled={loading}
					className="flex items-center gap-3 px-6 py-3 rounded-lg border border-(--color-border) bg-(--color-secondary) hover:bg-(--color-tertiary) transition-colors disabled:opacity-60"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
						<path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
					</svg>
					{loading ? 'Redirecting…' : 'Continue with Google'}
				</button>

				<button
					onClick={startGuestSignIn}
					disabled={guestLoading}
					className="flex items-center gap-3 px-6 py-3 rounded-lg border border-(--color-border) bg-(--color-secondary) hover:bg-(--color-tertiary) transition-colors disabled:opacity-60"
				>
					<UserRound className="w-[18px] h-[18px]" />
					{guestLoading ? 'Verifying…' : 'Continue as Guest'}
				</button>

				{/* Turnstile renders here after the guest button is clicked. */}
				<div ref={widgetRef} className={showCaptcha ? '' : 'hidden'} />

				{error && <p className="text-red-400 text-sm">{error}</p>}
			</div>
		</>
	);
}
