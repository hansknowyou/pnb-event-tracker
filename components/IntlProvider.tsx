'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';

export default function IntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [locale, setLocale] = useState<'en' | 'zh'>('en');

  // Update locale when user changes
  useEffect(() => {
    if (user?.languagePreference) {
      setLocale(user.languagePreference);
    }
  }, [user?.languagePreference]);

  // Select messages based on locale
  const messages = locale === 'zh' ? zhMessages : enMessages;

  // Always provide a locale, even during loading
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="America/New_York"
    >
      {children}
    </NextIntlClientProvider>
  );
}
