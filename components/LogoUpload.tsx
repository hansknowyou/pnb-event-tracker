'use client';

import { useId, useRef, useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
const DEFAULT_MAX_DIMENSION = 500;
const DEFAULT_MAX_FILE_SIZE = 1024 * 1024;

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
  maxDimension?: number;
  maxFileSize?: number;
  minDimension?: number;
  allowedMimeTypes?: string[];
  accept?: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
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
  maxDimension = DEFAULT_MAX_DIMENSION,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  minDimension = 0,
  allowedMimeTypes,
  accept,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
}: LogoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const allowedTypes = allowedMimeTypes ?? ALLOWED_TYPES;
  const acceptValue = accept ?? allowedTypes.join(',');

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

    if (!allowedTypes.includes(file.type)) {
      setError(messages.invalidType);
      resetInput();
      return;
    }

    if (maxFileSize > 0 && file.size > maxFileSize) {
      setError(messages.fileTooLarge);
      resetInput();
      return;
    }

    try {
      const { width, height } = await getImageDimensions(file);
      const widthTooSmall = minWidth !== undefined ? width < minWidth : minDimension > 0 && width < minDimension;
      const heightTooSmall = minHeight !== undefined ? height < minHeight : minDimension > 0 && height < minDimension;
      const widthTooLarge = maxWidth !== undefined ? width > maxWidth : width > maxDimension;
      const heightTooLarge = maxHeight !== undefined ? height > maxHeight : height > maxDimension;

      if (widthTooSmall || heightTooSmall || widthTooLarge || heightTooLarge) {
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
              accept={acceptValue}
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
