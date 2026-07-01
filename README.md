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
```

### 3. Set up the database

In the Supabase dashboard → **SQL Editor**, run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `chats` and `messages` tables and their RLS policies.

### 4. Enable Google sign-in

1. In **Google Cloud Console**, create an OAuth 2.0 Client. Set the authorized redirect URI to:
   ```
   https://YOUR-PROJECT.supabase.co/auth/v1/callback
   ```
2. In Supabase → **Authentication → Providers → Google**, paste the Client ID and Secret and enable the provider.
3. In Supabase → **Authentication → URL Configuration**, add `http://localhost:3000/**` (and your production URL) to the redirect allow-list.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be sent to `/login` to sign in with Google.

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
