'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTagColor } from '@/lib/tagColors';

interface StaffRoleSelectProps {
  value: string[];
  onChange: (roles: string[]) => void;
  availableRoles: string[];
  disabled?: boolean;
  placeholder?: string;
  selectLabel?: string;
  emptyLabel?: string;
}

export default function StaffRoleSelect({
  value,
  onChange,
  availableRoles,
  disabled = false,
  placeholder = 'Select roles',
  selectLabel = 'Select roles',
  emptyLabel = 'No roles available',
}: StaffRoleSelectProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleRole = (role: string) => {
    if (value.includes(role)) {
      onChange(value.filter((item) => item !== role));
    } else {
      onChange([...value, role]);
    }
  };

  const removeRole = (role: string) => {
    onChange(value.filter((item) => item !== role));
  };

  const sortedRoles = [...availableRoles].sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {value.length > 0 ? (
          value.map((role) => {
            const colorClasses = getTagColor(role);
            return (
              <span
                key={role}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
              >
                <span>{role}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="hover:opacity-70 rounded-full p-0.5 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            );
          })
        ) : (
          <span className="text-xs text-gray-400">{placeholder}</span>
        )}
      </div>

      {!disabled && (
        <div className="relative" ref={dropdownRef}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDropdown((open) => !open)}
            className="whitespace-nowrap"
          >
            {selectLabel}
          </Button>

          {showDropdown && (
            <div className="absolute left-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto min-w-[220px]">
              {sortedRoles.length > 0 ? (
                <div className="py-1">
                  {sortedRoles.map((role) => {
                    const isSelected = value.includes(role);
                    const colorClasses = getTagColor(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <div className="flex items-center justify-center w-4 h-4 border rounded flex-shrink-0">
                          {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
                        >
                          {role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 text-xs text-gray-500">
                  {emptyLabel}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
