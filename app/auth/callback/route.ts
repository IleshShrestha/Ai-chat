import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '../../utils/supabase/server';

// Handles the return from Google for both sign-in and guest account-linking.
// On success we get a `code` to exchange; on failure the provider appends
// `error_description`. Since a failed *link* leaves the guest still signed in,
// route errors to wherever the user can actually see them.
export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	const errorDescription = searchParams.get('error_description');
	const next = searchParams.get('next') ?? '/chat';

	const supabase = await createClient();

	const redirectWithError = async (message: string) => {
		// If there's still an active session (e.g. a guest whose link failed),
		// send them back into the app; otherwise back to login.
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const dest = user ? '/chat' : '/login';
		return NextResponse.redirect(
			`${origin}${dest}?authError=${encodeURIComponent(message)}`
		);
	};

	if (errorDescription) {
		return redirectWithError(errorDescription);
	}

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			return NextResponse.redirect(`${origin}${next}`);
		}
		return redirectWithError(error.message);
	}

	return redirectWithError('Authentication failed. Please try again.');
}
