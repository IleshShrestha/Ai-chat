-- Spark chat schema + Row-Level Security.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- RLS is the real security boundary: even a bug in the app cannot leak
-- one user's chats to another, because the database rejects the query.

-- ── Tables ────────────────────────────────────────────────────────────────
create table if not exists public.chats (
	id            uuid primary key default gen_random_uuid(),
	user_id       uuid not null references auth.users (id) on delete cascade,
	title         text not null default 'New Chat',
	created_at    timestamptz not null default now(),
	last_accessed timestamptz not null default now()
);

create table if not exists public.messages (
	id         uuid primary key default gen_random_uuid(),
	chat_id    uuid not null references public.chats (id) on delete cascade,
	sender     text not null check (sender in ('user', 'ai')),
	content    text not null,
	created_at timestamptz not null default now()
);

create index if not exists messages_chat_id_created_at_idx
	on public.messages (chat_id, created_at);
create index if not exists chats_user_id_last_accessed_idx
	on public.chats (user_id, last_accessed desc);

-- ── Row-Level Security ────────────────────────────────────────────────────
alter table public.chats    enable row level security;
alter table public.messages enable row level security;

-- Chats: a user may only touch rows they own.
create policy "own chats: select" on public.chats
	for select using (auth.uid() = user_id);
create policy "own chats: insert" on public.chats
	for insert with check (auth.uid() = user_id);
create policy "own chats: update" on public.chats
	for update using (auth.uid() = user_id);
create policy "own chats: delete" on public.chats
	for delete using (auth.uid() = user_id);

-- Messages: access is granted only if the parent chat belongs to the user.
create policy "own messages: select" on public.messages
	for select using (
		exists (select 1 from public.chats c
			where c.id = messages.chat_id and c.user_id = auth.uid())
	);
create policy "own messages: insert" on public.messages
	for insert with check (
		exists (select 1 from public.chats c
			where c.id = messages.chat_id and c.user_id = auth.uid())
	);
create policy "own messages: delete" on public.messages
	for delete using (
		exists (select 1 from public.chats c
			where c.id = messages.chat_id and c.user_id = auth.uid())
	);
