'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Users, MapPin, UserCog, ListOrdered, Ticket, Image, Building, Film, Megaphone } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations('admin');

  const navItems = [
    { href: '/admin/organization-profile', label: t('organizationProfile'), icon: Building },
    { href: '/admin/media-packages', label: t('mediaPackages'), icon: Film },
    { href: '/admin/promotion-channels', label: t('promotionChannels'), icon: Megaphone },
    { href: '/admin/users', label: t('users'), icon: Users },
    { href: '/admin/cities', label: t('cities'), icon: MapPin },
    { href: '/admin/staff-roles', label: t('staffRoles'), icon: UserCog },
    { href: '/admin/ticketing-platforms', label: t('ticketingPlatforms'), icon: Ticket },
    { href: '/admin/logos', label: t('logos'), icon: Image },
    { href: '/admin/step-config', label: t('stepConfig'), icon: ListOrdered },
  ];

  return (
    <div className="border-b mb-6">
      <nav className="flex space-x-4 overflow-x-auto whitespace-nowrap pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0',
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
