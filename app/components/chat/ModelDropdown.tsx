'use client';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Model {
  id: string;
  name: string;
}

interface ModelDropdownProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

const availableModels: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
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
          className={`flex items-center justify-between w-48 px-3 py-2 text-sm border border-gray-600 rounded-lg transition-colors ${
            disabled 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="font-medium">{selectedModelData?.name}</span>
          {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {/* Dropdown Menu (opens upward) */}
        {isDropdownOpen && !disabled && (
          <div className="absolute bottom-full left-0 mb-1 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedModel === model.id ? 'bg-gray-600' : ''
                }`}
              >
                <span className="font-medium text-gray-200">{model.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}