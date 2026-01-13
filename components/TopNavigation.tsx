'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TopNavigation() {
  const pathname = usePathname();

  const isEventTracking = pathname === '/' || pathname.startsWith('/events');
  const isProductionManagement = pathname.startsWith('/productions');

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold">PNB</div>
          </div>

          <div className="flex space-x-1">
            <Link
              href="/"
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isEventTracking
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              Event Tracking
            </Link>

            <Link
              href="/productions"
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isProductionManagement
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              Production Management
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
