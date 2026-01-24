'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Trash2, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
  onDelete?: () => void;
}

export default function CompanyCard({ company, onDelete }: CompanyCardProps) {
  const router = useRouter();
  const t = useTranslations('companies');

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader onClick={() => router.push(`/companies/${company._id}`)}>
        <CardTitle className="flex items-start justify-between">
          <span className="text-xl">{company.name}</span>
        </CardTitle>
        {company.city && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {company.city}
          </div>
        )}
      </CardHeader>
      <CardContent onClick={() => router.push(`/companies/${company._id}`)}>
        {company.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {company.description}
          </p>
        )}
        {company.staff && company.staff.length > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            {company.staff.length} {t('staffMembers')}
          </div>
        )}
        <div className="flex gap-2 mt-3">
          {company.files && (
            <a
              href={company.files}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('files')}
            </a>
          )}
          {company.images && (
            <a
              href={company.images}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('images')}
            </a>
          )}
        </div>
      </CardContent>
      {onDelete && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {t('delete')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
