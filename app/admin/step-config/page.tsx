'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import type { StepConfig, StepDefinition } from '@/types/productionStepConfig';
import { getDefaultStepConfig } from '@/types/productionStepConfig';

interface SortableStepItemProps {
  step: StepConfig;
  displayOrder: number;
  definition: StepDefinition | undefined;
  onToggle: (stepKey: string, enabled: boolean) => void;
  t: (key: string) => string;
}

function SortableStepItem({ step, displayOrder, definition, onToggle, t }: SortableStepItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.stepKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border rounded-lg mb-2 ${
        isDragging ? 'shadow-lg z-50' : 'shadow-sm'
      } ${!step.enabled ? 'opacity-60' : ''}`}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
        {displayOrder}
      </div>

      <div className="flex-1">
        <div className="font-medium">{t(step.stepKey)}</div>
        <div className="text-sm text-gray-500">{definition?.descriptionKey}</div>
      </div>

      {step.requiresVenue && (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
          <MapPin className="w-3 h-3" />
          {t('requiresVenue')}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className={`text-sm ${step.enabled ? 'text-green-600' : 'text-gray-400'}`}>
          {step.enabled ? t('enabled') : t('disabled')}
        </span>
        <Switch
          checked={step.enabled}
          onCheckedChange={(checked) => onToggle(step.stepKey, checked)}
        />
      </div>
    </div>
  );
}

export default function StepConfigPage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('stepConfig');
  const [steps, setSteps] = useState<StepConfig[]>([]);
  const [definitions, setDefinitions] = useState<StepDefinition[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/production-step-config');
      if (response.ok) {
        const data = await response.json();
        setSteps(data.steps);
        setDefinitions(data.definitions);
      }
    } catch (error) {
      console.error('Error fetching step config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.stepKey === active.id);
        const newIndex = items.findIndex((item) => item.stepKey === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update order numbers
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      });
    }
  };

  const handleToggle = (stepKey: string, enabled: boolean) => {
    setSteps((items) =>
      items.map((item) =>
        item.stepKey === stepKey ? { ...item, enabled } : item
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/production-step-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });

      if (response.ok) {
        setMessage(t('saved'));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(t('saveFailed'));
      }
    } catch (error) {
      console.error('Error saving step config:', error);
      setMessage(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm(t('resetConfirm'))) {
      const defaultConfig = getDefaultStepConfig();
      setSteps(defaultConfig);
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminNav />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminNav />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('resetToDefault')}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? t('saving') : t('saveChanges')}
              </Button>
            </div>
          </div>
          {message && (
            <div
              className={`mt-4 p-3 rounded ${
                message === t('saved')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{t('stepOrder')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('dragToReorder')}</p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((s) => s.stepKey)}
              strategy={verticalListSortingStrategy}
            >
              {steps.map((step, index) => (
                <SortableStepItem
                  key={step.stepKey}
                  step={step}
                  displayOrder={index + 1}
                  definition={definitions.find((d) => d.stepKey === step.stepKey)}
                  onToggle={handleToggle}
                  t={t}
                />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
