import { createClient } from "./supabase/client";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  lastAccessed: string;
  createdAt: string;
  messages: Message[];
}

export const GREETING =
  "Hello! I'm your AI assistant Spark. How can I help you today?";

interface ChatRow {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
}
interface MessageRow {
  id: string;
  sender: "user" | "ai";
  content: string;
  created_at: string;
}

function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    content: row.content,
    sender: row.sender,
    timestamp: row.created_at,
  };
}

// Get all chats for the signed-in user, most recently accessed first.
export async function getAllChats(): Promise<Chat[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chats")
    .select("id, title, created_at, last_accessed")
    .order("last_accessed", { ascending: false });

  if (error) {
    console.error("Error loading chats:", error);
    return [];
  }

  return (data as ChatRow[]).map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.created_at,
    lastAccessed: c.last_accessed,
    messages: [],
  }));
}

// Get a single chat with its messages in chronological order.
export async function getChatById(id: string): Promise<Chat | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chats")
    .select(
      "id, title, created_at, last_accessed, messages(id, sender, content, created_at)",
    )
    .eq("id", id)
    .order("created_at", { referencedTable: "messages", ascending: true })
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    createdAt: data.created_at,
    lastAccessed: data.last_accessed,
    messages: (data.messages as MessageRow[]).map(toMessage),
  };
}

// Create a new chat (seeded with Spark's greeting) and return its ID.
// Returns null if there is no authenticated user.
export async function createNewChat(title: string): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: user.id, title: title || "New Chat" })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating chat:", error);
    return null;
  }

  await supabase
    .from("messages")
    .insert({ chat_id: data.id, sender: "ai", content: GREETING });

  return data.id;
}

// Delete a chat (messages cascade in the DB).
export async function deleteChatById(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("chats").delete().eq("id", id);
  if (error) {
    console.error("Error deleting chat:", error);
    return false;
  }
  return true;
}

// Update a chat's title.
export async function updateChatTitle(
  chatId: string,
  title: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId);
  if (error) console.error("Error updating title:", error);
}

// Bump last_accessed so the chat sorts to the top of the list.
export async function updateLastAccessed(chatId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("chats")
    .update({ last_accessed: new Date().toISOString() })
    .eq("id", chatId);
  if (error) console.error("Error updating last accessed:", error);
}

// Build a title from the first user message (used server-side too).
export function generateChatTitle(firstUserMessage: string): string {
  if (!firstUserMessage || typeof firstUserMessage !== "string") {
    return "New Chat";
  }
  const clean = firstUserMessage.trim().replace(/\n+/g, " ");
  if (!clean) return "New Chat";
  const title = clean.substring(0, 30);
  return title.length < clean.length ? title + "..." : title;
}
