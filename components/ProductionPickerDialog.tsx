'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import type { Production } from '@/types/production';
import { useTranslations } from 'next-intl';

interface ProductionPickerDialogProps {
  open: boolean;
  onSelect: (productionId: string) => void;
  onClose: () => void;
}

export default function ProductionPickerDialog({
  open,
  onSelect,
  onClose,
}: ProductionPickerDialogProps) {
  const t = useTranslations('eventTracking');
  const [productions, setProductions] = useState<Production[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProductions();
    }
  }, [open]);

  const fetchProductions = async () => {
    setLoading(true);
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

  const filteredProductions = productions.filter((prod) =>
    prod.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (productionId: string) => {
    onSelect(productionId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('pickerTitle')}</DialogTitle>
          <DialogDescription>{t('pickerDescription')}</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('pickerSearchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8 text-gray-500">{t('pickerLoading')}</div>
          ) : filteredProductions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? t('pickerNoResults') : t('pickerEmpty')}
            </div>
          ) : (
            filteredProductions.map((prod) => (
              <div
                key={prod._id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => handleSelect(prod._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{prod.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('pickerCreated')} {new Date(prod.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {t('pickerCompletion', { percent: prod.completionPercentage || 0 })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
