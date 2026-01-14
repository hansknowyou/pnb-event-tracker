'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import TopNavigation from '@/components/TopNavigation';
import IntlProvider from '@/components/IntlProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <IntlProvider>
        <TopNavigation />
        <main>{children}</main>
      </IntlProvider>
    </AuthProvider>
  );
}
