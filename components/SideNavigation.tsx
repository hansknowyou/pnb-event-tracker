'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Users,
  X,
} from 'lucide-react';

interface SideNavigationProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function SideNavigation({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SideNavigationProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isEventTracking = pathname === '/' || pathname.startsWith('/events');
  const isProductionManagement = pathname.startsWith('/productions');
  const isKnowledgeBase = pathname.startsWith('/knowledge-base');
  const isVenues = pathname.startsWith('/venues');
  const isCommunities = pathname.startsWith('/communities');
  const isCompanies = pathname.startsWith('/companies');

  const navItems = [
    { href: '/', label: t('eventTracking'), active: isEventTracking, icon: Home },
    { href: '/productions', label: t('productionManagement'), active: isProductionManagement, icon: BookOpen },
    { href: '/knowledge-base', label: t('knowledgeBase'), active: isKnowledgeBase, icon: BookOpen },
    { href: '/venues', label: t('venues'), active: isVenues, icon: MapPin },
    { href: '/communities', label: t('communities'), active: isCommunities, icon: Users },
    { href: '/companies', label: t('companies'), active: isCompanies, icon: Building2 },
  ];

  const renderLinks = (compact: boolean) => (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              item.active
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              compact && 'justify-center px-2'
            )}
            title={compact ? item.label : undefined}
          >
            <Icon className="w-4 h-4" />
            {!compact && <span>{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col border-r bg-white sticky top-0 h-screen transition-all',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className={cn('h-16 flex items-center justify-between', collapsed ? 'px-2' : 'px-4')}>
          {!collapsed && <div className="text-lg font-bold">CCCDA</div>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        <nav className={cn('flex-1 px-2', collapsed && 'px-1')}>
          {renderLinks(collapsed)}
        </nav>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 lg:hidden"
          onClick={onMobileClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-y-0 left-0 w-72 bg-white shadow-lg p-4 flex flex-col gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">CCCDA</div>
              <Button variant="ghost" size="icon" onClick={onMobileClose} aria-label="Close menu">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="mt-2">{renderLinks(false)}</nav>
          </div>
        </div>
      )}
    </>
  );
}
