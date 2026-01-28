'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, ChevronDown, ChevronRight } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import PreviewLink from '@/components/PreviewLink';
import type { SocialMedia, PromotionItem, PromoMediaFile } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import type { PromotionChannel } from '@/types/promotionChannel';

interface Step12Props {
  data: SocialMedia;
  onChange: (data: SocialMedia) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step12SocialMedia({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step12Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [promotionChannels, setPromotionChannels] = useState<PromotionChannel[]>([]);
  const [expandedPromos, setExpandedPromos] = useState<Record<string, boolean>>({});
  const promotions = data.promotions || [];

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/promotion-channels');
        if (response.ok) {
          const items = await response.json();
          setPromotionChannels(items || []);
        }
      } catch (error) {
        console.error('Error fetching promotion channels:', error);
      }
    };
    fetchChannels();
  }, []);

  const addPromotion = () => {
    const nextPromo: PromotionItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      promotionChannelId: '',
      mediaFiles: [],
    };
    setExpandedPromos((prev) => ({ ...prev, [nextPromo.id]: true }));
    onChange({ ...data, promotions: [...promotions, nextPromo] });
  };

  const removePromotion = (id: string) => {
    setExpandedPromos((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    onChange({ ...data, promotions: promotions.filter((promo) => promo.id !== id) });
  };

  const togglePromotion = (id: string) => {
    setExpandedPromos((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const updatePromotion = (id: string, updates: Partial<PromotionItem>) => {
    onChange({
      ...data,
      promotions: promotions.map((promo) =>
        promo.id === id ? { ...promo, ...updates } : promo
      ),
    });
  };

  const addMediaFile = (promoId: string) => {
    const nextFile: PromoMediaFile = {
      id: Date.now().toString(),
      name: '',
      link: '',
    };
    onChange({
      ...data,
      promotions: promotions.map((promo) =>
        promo.id === promoId ? { ...promo, mediaFiles: [...promo.mediaFiles, nextFile] } : promo
      ),
    });
  };

  const removeMediaFile = (promoId: string, fileId: string) => {
    onChange({
      ...data,
      promotions: promotions.map((promo) =>
        promo.id === promoId
          ? { ...promo, mediaFiles: promo.mediaFiles.filter((file) => file.id !== fileId) }
          : promo
      ),
    });
  };

  const updateMediaFile = (promoId: string, fileId: string, updates: Partial<PromoMediaFile>) => {
    onChange({
      ...data,
      promotions: promotions.map((promo) =>
        promo.id === promoId
          ? {
              ...promo,
              mediaFiles: promo.mediaFiles.map((file) =>
                file.id === fileId ? { ...file, ...updates } : file
              ),
            }
          : promo
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step12')}</h3>
          <p className="text-gray-600">Online Promotion 线上宣传</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step12"
                linkedIds={linkedKnowledge.map(k => k._id)}
                onChange={onKnowledgeChange}
              />
              {linkedKnowledge.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKnowledge(true)}
                >
                  {t('view')} ({linkedKnowledge.length})
                </Button>
              )}
            </>
          )}
          {productionId && onAssignmentChange && (
            <AssignButton
              section="step12"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Label className="mb-0">Google Drive Link</Label>
              <PreviewLink href={data.strategyLink?.link || ''} />
            </div>
            <Input
              type="url"
              placeholder="https://..."
              value={data.strategyLink?.link || ''}
              onChange={(e) => onChange({
                ...data,
                strategyLink: { ...(data.strategyLink || { link: '', notes: '' }), link: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.strategyLink?.notes || ''}
              onChange={(e) => onChange({
                ...data,
                strategyLink: { ...(data.strategyLink || { link: '', notes: '' }), notes: e.target.value }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {promotions.map((promo, promoIndex) => (
            <div key={promo.id} className="border-2 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePromotion(promo.id)}
                    className="px-2"
                  >
                    {(expandedPromos[promo.id] ?? true) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <h5 className="font-semibold text-lg">
                    Promo {promoIndex + 1}
                    {promo.title?.trim() ? ` • ${promo.title}` : ''}
                  </h5>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePromotion(promo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {(expandedPromos[promo.id] ?? true) && (
                <>
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="e.g., Opening Week Promo"
                      value={promo.title}
                      onChange={(e) => updatePromotion(promo.id, { title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Short description..."
                      rows={2}
                      value={promo.description}
                      onChange={(e) => updatePromotion(promo.id, { description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Promotion Channel</Label>
                    <Select
                      value={promo.promotionChannelId}
                      onValueChange={(value) => updatePromotion(promo.id, { promotionChannelId: value })}
                    >
                      <SelectTrigger onBlur={onBlur}>
                        <SelectValue placeholder="Select a channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {promotionChannels.map((channel) => (
                          <SelectItem key={channel._id} value={channel._id || ''}>
                            {channel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <h6 className="font-medium mb-3">Media Files</h6>
                    <div className="space-y-3">
                      {promo.mediaFiles.map((file, fileIndex) => (
                        <div key={file.id} className="border rounded p-3 space-y-3 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">File {fileIndex + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMediaFile(promo.id, file.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          <div>
                            <Label className="text-xs">Name</Label>
                            <Input
                              placeholder="e.g., Content Link"
                              value={file.name}
                              onChange={(e) => updateMediaFile(promo.id, file.id, { name: e.target.value })}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <Label className="mb-0 text-xs">Link</Label>
                              <PreviewLink href={file.link} className="text-xs" />
                            </div>
                            <Input
                              type="url"
                              placeholder="https://..."
                              value={file.link}
                              onChange={(e) => updateMediaFile(promo.id, file.id, { link: e.target.value })}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={() => addMediaFile(promo.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="w-3 h-3 mr-2" />
                        Add Media File
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          <Button onClick={addPromotion} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Promo
          </Button>
        </CardContent>
      </Card>

      <KnowledgeViewDialog
        knowledgeItems={linkedKnowledge}
        open={showKnowledge}
        onClose={() => setShowKnowledge(false)}
      />
    </div>
  );
}
