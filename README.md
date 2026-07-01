# ⚡ Spark

A full-stack AI chat application built with Next.js, Supabase, and OpenAI. Spark pairs a streaming chat interface with Google sign-in and a Postgres backend, so conversations are private, persistent, and available across devices.

**🔗 [Live Demo](https://ai-spark-ivory.vercel.app/)**

## Features

### Chat

- **Streaming responses** — tokens render in real time as the model generates them.
- **Conversation memory** — the full message history is sent to the model on every turn, so Spark remembers the context of the conversation.
- **Rich Markdown** — GitHub-flavored Markdown, syntax-highlighted code blocks, and **LaTeX math** rendered with KaTeX.
- **Multiple models** — switch between OpenAI models (e.g. GPT-4o, GPT-4o-mini) per conversation.

### Accounts & data

- **Google sign-in** via Supabase Auth — no passwords to manage.
- **Guest mode** — try Spark instantly with an anonymous account (Supabase anonymous auth), gated by a Cloudflare Turnstile CAPTCHA. Guests can later **link a Google account** to keep their history, and are warned before signing out that guest chats are lost.
- **Persistent history** stored in Supabase Postgres and available on any device.
- **Row-Level Security** — every row is scoped to its owner in the database, so a user can only ever read their own chats.
- **Lazy chat creation** — a new chat isn't saved until you send your first message, keeping the history clean.
- **Manage chats** — auto-generated titles, rename, and delete.
- **Themes** — light, dark, and green.

## Tech Stack

| Layer     | Technology                                                                                                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router)                                                                                                |
| Language  | [TypeScript](https://www.typescriptlang.org/)                                                                                                 |
| UI        | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Motion](https://motion.dev/)                                     |
| Auth & DB | [Supabase](https://supabase.com/) (Auth + Postgres + RLS)                                                                                     |
| AI        | [OpenAI API](https://platform.openai.com/) (streaming)                                                                                        |
| Markdown  | [react-markdown](https://github.com/remarkjs/react-markdown), remark-gfm, remark-math, rehype-katex, [highlight.js](https://highlightjs.org/) |
| Icons     | [Lucide React](https://lucide.dev/)                                                                                                           |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Supabase](https://supabase.com/) project
- A Google OAuth client ([Google Cloud Console](https://console.cloud.google.com/))
- A [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget (free) — only needed if you enable guest mode

### 1. Install

```bash
git clone <repository-url>
cd spark
npm install
```

### 2. Configure environment

Copy [`.env.example`](.env.example) to `.env.local` and fill in your keys:

```env
OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Only needed for guest mode (see step 5). Cloudflare's always-pass dev key: 1x00000000000000000000AA
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

> `NEXT_PUBLIC_*` variables are read at **build time**. After changing any of them, restart the dev server (or redeploy) — they won't hot-reload.

### 3. Set up the database

In the Supabase dashboard → **SQL Editor**, run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `chats` and `messages` tables and their RLS policies.

### 4. Enable Google sign-in

1. In **Google Cloud Console**, create an OAuth 2.0 Client. Set the authorized redirect URI to:
   ```
   https://YOUR-PROJECT.supabase.co/auth/v1/callback
   ```
2. In Supabase → **Authentication → Providers → Google**, paste the Client ID and Secret and enable the provider.
3. In Supabase → **Authentication → URL Configuration**:
   - Set the **Site URL** to your app's URL (`http://localhost:3000` locally) — this is where users land after signing in.
   - Add `http://localhost:3000/**` (and your production URL) to the **Redirect URLs** allow-list.

### 5. Enable guest mode _(optional)_

Guest mode uses Supabase anonymous authentication with a Cloudflare Turnstile CAPTCHA. Skip this if you only want Google sign-in — but note the **Continue as Guest** button will error without it.

1. In Supabase → **Authentication → Sign In / Providers**, enable **Allow anonymous sign-ins**.
2. In Supabase → **Authentication → Attack Protection**, enable **CAPTCHA protection**, choose **Turnstile**, and paste your Turnstile **secret key**. Put the matching **site key** in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. (For local testing, use Cloudflare's test pair: site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.)
3. To let guests upgrade to a real account, enable **Allow manual linking** in Supabase → **Authentication → settings**.

> Anonymous users are real `auth.users` rows. They accumulate over time and can't sign back in once they log out, so consider a scheduled job to delete old anonymous users.

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be sent to `/login` to sign in with Google or continue as a guest.

## Deployment

Deploying to a host like [Vercel](https://vercel.com/):

1. Add every variable from your `.env.local` to the host's **Environment Variables** (Production + Preview). They aren't read from `.env.local`, which is gitignored.
2. Add your production URL to the Supabase **Redirect URLs** allow-list, and set it as the Supabase **Site URL** so post-login redirects work.
3. The Google OAuth **redirect URI stays the Supabase one** (`https://YOUR-PROJECT.supabase.co/auth/v1/callback`) — you do **not** add the production domain there.
4. Redeploy after changing env vars — `NEXT_PUBLIC_*` values are baked in at build time.

## Project Structure

```
app/
├── api/chat/route.ts        # Authenticated streaming endpoint (loads history, persists replies)
├── auth/                    # OAuth callback + sign-out route handlers
├── login/                   # Google sign-in page
├── chat/                    # ChatView + draft (/chat) and existing (/chat/[id]) routes
├── components/              # Sidebar, message bubbles, modals, settings
├── hooks/                   # useChat, useChatData, useChatList, streaming, scroll
├── utils/
│   ├── chatStorage.ts       # Supabase-backed chat/message data access
│   └── supabase/            # Browser, server, and middleware clients
middleware.ts                # Session refresh + route protection
supabase/schema.sql          # Tables + Row-Level Security policies
```

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Production build             |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |
