'use client';

import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import TopNavigation from '@/components/TopNavigation';
import SideNavigation from '@/components/SideNavigation';
import IntlProvider from '@/components/IntlProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthProvider>
      <IntlProvider>
        <div className="flex min-h-screen">
          <SideNavigation
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
          <div className="flex-1 min-w-0">
            <TopNavigation onMenuClick={() => setMobileOpen(true)} />
            <main>{children}</main>
          </div>
        </div>
      </IntlProvider>
    </AuthProvider>
  );
}
