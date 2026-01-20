'use client';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent backdrop (blocks interactions) */}
      <div className="absolute inset-0" />

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Spinning loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping opacity-20 border-t-blue-400" />
        </div>

        {/* Loading text */}
        {message && (
          <p className="text-gray-700 font-medium text-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
