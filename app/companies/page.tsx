'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompanyCard from '@/components/CompanyCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import type { Company } from '@/types/company';

export default function CompaniesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('companies');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCompanies(companies.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} message="Loading..." />
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        {user?.isAdmin && (
          <Button onClick={() => router.push('/companies/new')}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addCompany')}
          </Button>
        )}
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">{t('noCompanies')}</p>
          {user?.isAdmin && (
            <Button onClick={() => router.push('/companies/new')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('createFirst')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onDelete={user?.isAdmin ? () => handleDelete(company._id) : undefined}
            />
          ))}
        </div>
      )}
      </div>
    </>
  );
}
