'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import TopNavigation from '@/components/TopNavigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <TopNavigation />
      <main>{children}</main>
    </AuthProvider>
  );
}
