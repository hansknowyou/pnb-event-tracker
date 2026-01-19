'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, Edit, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Production } from '@/types/production';

export default function ProductionsPage() {
  const router = useRouter();
  const t = useTranslations('production');
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const response = await fetch('/api/productions');
      if (response.ok) {
        const data = await response.json();
        setProductions(data);
      }
    } catch (error) {
      console.error('Error fetching productions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const response = await fetch('/api/productions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t('untitled') }),
      });

      if (response.ok) {
        const newProduction = await response.json();
        router.push(`/productions/${newProduction._id}`);
      }
    } catch (error) {
      console.error('Error creating production:', error);
      alert(t('createFailed'));
    }
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage === 0) {
      return <Badge variant="secondary">{t('status.notStarted')}</Badge>;
    } else if (percentage === 100) {
      return <Badge className="bg-green-600">{t('status.completed')}</Badge>;
    } else {
      return <Badge variant="default">{t('status.inProgress')}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">{t('loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </div>

        <Button onClick={handleCreateNew} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          {t('createNew')}
        </Button>
      </div>

      {productions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t('noProductions')}
            </h3>
            <p className="text-gray-500 mb-6">
              {t('noProductionsDesc')}
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              {t('createProduction')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productions.map((production) => (
            <Card
              key={production._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/productions/${production._id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-2">
                    {production.title}
                  </CardTitle>
                  {getStatusBadge(production.completionPercentage)}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('created')}: {formatDate(production.createdAt)}
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{t('progress')}</span>
                      <span className="font-semibold">
                        {production.completionPercentage}%
                      </span>
                    </div>
                    <Progress value={production.completionPercentage} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/productions/${production._id}`);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/productions/${production._id}/dashboard`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('view')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
