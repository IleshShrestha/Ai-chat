export interface Message {
	id: string;
	content: string;
	sender: 'user' | 'ai';
	timestamp: string; 
}

export interface Chat {
	id: string;
	title: string;
	lastAccessed: string; 
	createdAt: string; 
	messages: Message[];
}

export interface ChatData {
	chats: Record<string, Chat>;
}

const STORAGE_KEY = 'chatData';

// Get all chat data from localStorage
function getChatData(): ChatData {
	
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : { chats: {} };
	} catch (error) {
		console.error('Error reading chat data:', error);
		return { chats: {} };
	}
}

// Save chat data to localStorage
function saveChatData(data: ChatData): void {
	
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving chat data:', error);
	}
}

// Get all chats sorted by lastAccessed (most recent first)
export function getAllChats(): Chat[] {
	const data = getChatData();
	return Object.values(data.chats)
		.sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
}

// Get specific chat by ID
export function getChatById(id: string): Chat | null {
	const data = getChatData();
	return data.chats[id] || null;
}

// Create a new chat and return its ID
export function createNewChat(title: string): string {
	const chatId = crypto.randomUUID();
	const now = new Date().toISOString();
	
	const newChat: Chat = {
		id: chatId,
		title: title || 'New Chat',
		lastAccessed: now,
		createdAt: now,
		messages: [{
			id: '1',
			content: "Hello! I'm your AI assistant Spark. How can I help you today?",
			sender: 'ai',
			timestamp: now,
		}]
	};
	
	const data = getChatData();
	data.chats[chatId] = newChat;
	saveChatData(data);
	
	return chatId;
}

// Add a message to a specific chat
export function saveChatMessage(chatId: string, message: Omit<Message, 'timestamp'> & { timestamp: Date }): void {
	try {
		const data = getChatData();
		const chat = data.chats[chatId];
		
		if (!chat) {
			console.error(`Chat with ID ${chatId} not found`);
			return;
		}
		
		// Validate message structure
		if (!message.id || !message.content || !message.sender) {
			console.error('Invalid message structure:', message);
			return;
		}
		
		const messageWithTimestamp: Message = {
			...message,
			timestamp: message.timestamp ? message.timestamp.toISOString() : new Date().toISOString()
		};
		
		// Ensure messages array exists
		if (!chat.messages || !Array.isArray(chat.messages)) {
			chat.messages = [];
		}
		
		chat.messages.push(messageWithTimestamp);
		chat.lastAccessed = new Date().toISOString();
		
		saveChatData(data);
	} catch (error) {
		console.error('Error saving chat message:', error);
	}
}

// Update last accessed time for a chat
export function updateLastAccessed(chatId: string): void {
	const data = getChatData();
	const chat = data.chats[chatId];
	
	if (!chat) {
		console.error(`Chat with ID ${chatId} not found`);
		return;
	}
	
	chat.lastAccessed = new Date().toISOString();
	saveChatData(data);
}

// Delete a chat by ID
export function deleteChatById(id: string): boolean {
	const data = getChatData();
	
	if (!data.chats[id]) {
		return false;
	}
	
	delete data.chats[id];
	saveChatData(data);
	return true;
}

// Update chat title
export function updateChatTitle(chatId: string, title: string): void {
	const data = getChatData();
	const chat = data.chats[chatId];
	
	if (!chat) {
		console.error(`Chat with ID ${chatId} not found`);
		return;
	}
	
	chat.title = title;
	saveChatData(data);
}

// Auto-generate chat title from first user message
export function generateChatTitle(firstUserMessage: string): string {
	if (!firstUserMessage || typeof firstUserMessage !== 'string') {
		return 'New Chat';
	}
	
	// Clean the message and take first 30 characters for the title
	const cleanMessage = firstUserMessage.trim().replace(/\n+/g, ' ');
	if (!cleanMessage) {
		return 'New Chat';
	}
	
	const title = cleanMessage.substring(0, 30);
	return title.length < cleanMessage.length ? title + '...' : title;
}
