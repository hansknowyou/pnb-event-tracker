'use client';

import { useId, useRef, useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
const MAX_DIMENSION = 500;
const MAX_FILE_SIZE = 1024 * 1024;

interface LogoUploadMessages {
  invalidType: string;
  fileTooLarge: string;
  dimensionTooLarge: string;
  loadFailed: string;
  remove: string;
  empty: string;
}

interface LogoUploadProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  helpText: string;
  messages: LogoUploadMessages;
  disabled?: boolean;
}

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const getImageDimensions = (file: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });

export default function LogoUpload({
  value,
  onChange,
  label,
  helpText,
  messages,
  disabled = false,
}: LogoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    resetInput();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(messages.invalidType);
      resetInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(messages.fileTooLarge);
      resetInput();
      return;
    }

    try {
      const { width, height } = await getImageDimensions(file);
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        setError(messages.dimensionTooLarge);
        resetInput();
        return;
      }

      const dataUrl = await readAsDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      console.error('Logo upload failed:', err);
      setError(messages.loadFailed);
      resetInput();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="h-24 w-24 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
          {value ? (
            <img
              src={value}
              alt={label}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-gray-400">{messages.empty}</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {!disabled && (
            <Input
              id={inputId}
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
            />
          )}
          <p className="text-xs text-gray-500">{helpText}</p>
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          {value && !disabled && (
            <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
              {messages.remove}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
