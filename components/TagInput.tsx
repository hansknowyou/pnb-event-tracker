'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getTagColor } from '@/lib/tagColors';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  availableTags?: string[];
}

export default function TagInput({
  tags,
  onChange,
  placeholder = 'Type new tag name and press Enter...',
  availableTags = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      // Remove tag
      onChange(tags.filter(t => t !== tag));
    } else {
      // Add tag
      onChange([...tags, tag]);
    }
  };

  const createNewTag = () => {
    const trimmedTag = inputValue.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      if (trimmedTag.length <= 50) {
        onChange([...tags, trimmedTag]);
        setInputValue('');
      } else {
        alert('Tag must be 50 characters or less');
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        createNewTag();
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      {/* Display selected tags */}
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.map((tag, index) => {
          const colorClasses = getTagColor(tag);
          return (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70 rounded-full p-0.5 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {/* Input for creating new tags */}
        <div className="flex-1">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={50}
          />
        </div>

        {/* Dropdown button for selecting existing tags */}
        <div className="relative" ref={dropdownRef}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDropdown(!showDropdown)}
            className="whitespace-nowrap"
          >
            Select Tags
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          {/* Dropdown Menu with checkboxes */}
          {showDropdown && (
            <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto min-w-[250px]">
              {availableTags.length > 0 ? (
                <>
                  <div className="p-2 text-xs text-gray-500 font-medium border-b">
                    Select from existing tags:
                  </div>
                  <div className="py-1">
                    {availableTags.map((tag, index) => {
                      const isSelected = tags.includes(tag);
                      const colorClasses = getTagColor(tag);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <div className="flex items-center justify-center w-4 h-4 border rounded flex-shrink-0">
                            {isSelected && (
                              <Check className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
                          >
                            {tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No existing tags yet. Create your first tag using the input field above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Type a new tag name and press Enter to create, or click "Select Tags" to choose from existing ones.
      </p>
    </div>
  );
}
