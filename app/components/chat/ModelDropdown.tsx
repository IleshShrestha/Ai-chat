'use client';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Model {
	id: string;
	name: string;
	description: string;
}

interface ModelDropdownProps {
	selectedModel: string;
	onModelChange: (modelId: string) => void;
	disabled?: boolean;
}

const availableModels: Model[] = [
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		description: 'Most advanced model with improved speed and intelligence'
	},
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4o Mini',
		description: 'Fast and efficient, great for most tasks'
	},
	{
		id: 'gpt-4',
		name: 'GPT-4',
		description: 'Powerful model with excellent reasoning capabilities'
	},
	{
		id: 'gpt-3.5-turbo',
		name: 'GPT-3.5 Turbo',
		description: 'Fast and cost-effective for simple tasks'
	},
];

export default function ModelDropdown({ selectedModel, onModelChange, disabled = false }: ModelDropdownProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest('.model-dropdown')) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isDropdownOpen]);

	const selectedModelData = availableModels.find(m => m.id === selectedModel);

	return (
		<div className="mb-3 flex justify-center">
			<div className="relative model-dropdown">
				<button
					onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
					disabled={disabled}
					className={`flex items-center justify-between w-48 px-3 py-2 text-sm border border-(--color-border) rounded-lg transition-colors ${disabled
						? 'bg-(--color-secondary) text-(--color-text-muted) cursor-not-allowed'
						: 'bg-(--color-secondary) text-(--color-text-secondary) hover:bg-(--color-tertiary)'
						}`}
				>
					<span className="font-medium">{selectedModelData?.name}</span>
					{isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
				</button>

				{/* Dropdown Menu (opens upward) */}
				{isDropdownOpen && !disabled && (
					<div className="absolute bottom-full left-0 mb-1 w-64 bg-(--color-secondary) border border-(--color-border) rounded-lg shadow-lg z-10">
						{availableModels.map((model) => (
							<button
								key={model.id}
								onClick={() => {
									onModelChange(model.id);
									setIsDropdownOpen(false);
								}}
								className={`w-full px-3 py-2.5 text-left hover:bg-(--color-tertiary) transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedModel === model.id ? 'bg-(--color-tertiary)' : ''
									}`}
							>
								<span className="font-medium text-(--color-text-secondary) block">{model.name}</span>
								<span className="text-xs text-(--color-text-muted) mt-0.5 block">{model.description}</span>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}