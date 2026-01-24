'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface RenameModalProps {
	isOpen: boolean;
	chatId: string;
	currentTitle: string;
	onClose: () => void;
	onSave: (chatId: string, newTitle: string) => void;
}

export default function RenameModal({ isOpen, chatId, currentTitle, onClose, onSave }: RenameModalProps) {
	const [title, setTitle] = useState(currentTitle);

	useEffect(() => {
		setTitle(currentTitle);
	}, [currentTitle, isOpen]);

	const handleSave = () => {
		if (title.trim()) {
			onSave(chatId, title.trim());
			onClose();
		}
	};

	const handleCancel = () => {
		setTitle(currentTitle);
		onClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSave();
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Rename this chat
							</h3>
							<button
								onClick={onClose}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						
						<div className="mb-6">
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onKeyDown={handleKeyDown}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
								placeholder="Enter chat title"
								autoFocus
							/>
						</div>
						
						<div className="flex justify-end space-x-3">
							<button
								onClick={handleCancel}
								className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={!title.trim()}
								className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
							>
								Save
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}