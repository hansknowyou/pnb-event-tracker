'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getTagColor } from '@/lib/tagColors';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagDeselect: (tag: string) => void;
  onClearAll: () => void;
}

export default function TagFilter({
  allTags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onClearAll,
}: TagFilterProps) {
  const isTagSelected = (tag: string) => selectedTags.includes(tag);

  const toggleTag = (tag: string) => {
    if (isTagSelected(tag)) {
      onTagDeselect(tag);
    } else {
      onTagSelect(tag);
    }
  };

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-sm"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = isTagSelected(tag);
          const colorClasses = getTagColor(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${
                isSelected
                  ? `${colorClasses} ring-2 ring-offset-1 ring-blue-500 shadow-sm`
                  : `${colorClasses} opacity-60 hover:opacity-100`
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <p className="text-sm text-gray-600 mt-3">
          Filtering by {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
