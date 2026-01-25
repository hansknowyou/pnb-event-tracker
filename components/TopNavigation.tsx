'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TopNavigationProps {
  onMenuClick?: () => void;
}

export default function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const t = useTranslations('nav');
  const isLogin = pathname === '/login';

  if (isLogin) return null;
  if (loading) return null;

  if (!user && typeof window !== 'undefined') {
    router.push('/login');
    return null;
  }

  if (!user) return null;

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="text-xl font-bold lg:hidden">CCCDA</div>
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
