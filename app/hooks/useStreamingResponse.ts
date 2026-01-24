'use client';

interface StreamingCallbacks {
	onFirstChunk: () => void;
	onChunk: (content: string) => void;
	onComplete: (fullContent: string) => void;
	onError: (error: Error) => void;
}

export default async function streamResponse(
	message: string,
	selectedModel: string,
	callbacks: StreamingCallbacks
): Promise<void> {
	try {
		const response = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({ 
				message,
				model: selectedModel 
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		if (!response.body) {
			throw new Error('No response body');
		}

		// Read the streaming response
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let fullContent = '';
		let hasStartedStreaming = false;

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });
			const lines = chunk.split('\n');

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					try {
						const data = JSON.parse(line.slice(6));
						
						if (data.error) {
							throw new Error(data.error);
						}
						
						if (data.content) {
							fullContent += data.content;
							
							// If this is the first chunk, notify that streaming has started
							if (!hasStartedStreaming) {
								hasStartedStreaming = true;
								callbacks.onFirstChunk();
							}
							
							// Notify about the new chunk
							callbacks.onChunk(fullContent);
						}
						
						if (data.done) {
							// If streaming never started but is done, handle empty response
							if (!hasStartedStreaming) {
								hasStartedStreaming = true;
								callbacks.onFirstChunk();
								fullContent = fullContent || "I'm sorry, but I couldn't generate a response. Please try again.";
								callbacks.onChunk(fullContent);
							}
							
							// Streaming complete
							callbacks.onComplete(fullContent);
							return;
						}
					} catch (parseError) {
						console.error('Error parsing streaming data:', parseError);
					}
				}
			}
		}
	} catch (error) {
		console.error('Error in streaming response:', error);
		callbacks.onError(error instanceof Error ? error : new Error('Unknown streaming error'));
	}
}