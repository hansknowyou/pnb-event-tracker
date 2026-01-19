'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const t = useTranslations('nav');

  const isEventTracking = pathname === '/' || pathname.startsWith('/events');
  const isProductionManagement = pathname.startsWith('/productions');
  const isKnowledgeBase = pathname.startsWith('/knowledge-base');
  const isVenues = pathname.startsWith('/venues');
  const isCommunities = pathname.startsWith('/communities');
  const isLogin = pathname === '/login';

  // Don't show navigation on login page
  if (isLogin) return null;

  // Show loading state
  if (loading) return null;

  // If not logged in, redirect to login (client-side only)
  if (!user && typeof window !== 'undefined') {
    router.push('/login');
    return null;
  }

  // Don't render anything if no user yet
  if (!user) return null;

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold">CCCDA</div>
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
                {t('eventTracking')}
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
                {t('productionManagement')}
              </Link>

              <Link
                href="/knowledge-base"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isKnowledgeBase
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {t('knowledgeBase')}
              </Link>

              <Link
                href="/venues"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isVenues
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {t('venues')}
              </Link>

              <Link
                href="/communities"
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  isCommunities
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {t('communities')}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {user.displayName}
            </div>

            {user.isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/users')}
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('admin')}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile')}
            >
              <User className="w-4 h-4 mr-2" />
              {t('profile')}
            </Button>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
