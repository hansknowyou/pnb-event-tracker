'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link as LinkIcon, ExternalLink, X } from 'lucide-react';
import ProductionPickerDialog from './ProductionPickerDialog';
import type { Event } from '@/types';
import type { Production } from '@/types/production';
import { useRouter } from 'next/navigation';

interface ProductionLinkButtonsProps {
  event: Event;
  linkedProduction?: Production | null;
  onUpdate: () => void;
}

export default function ProductionLinkButtons({
  event,
  linkedProduction,
  onUpdate,
}: ProductionLinkButtonsProps) {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLink = async (productionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${event._id}/production-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productionId }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to link production');
      }
    } catch (error) {
      console.error('Error linking production:', error);
      alert('Failed to link production');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${event._id}/production-link`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowUnlinkConfirm(false);
        onUpdate();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to unlink production');
      }
    } catch (error) {
      console.error('Error unlinking production:', error);
      alert('Failed to unlink production');
    } finally {
      setLoading(false);
    }
  };

  if (!linkedProduction) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(true)}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Link Production
        </Button>

        <ProductionPickerDialog
          open={showPicker}
          onSelect={handleLink}
          onClose={() => setShowPicker(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1 flex items-center gap-2">
          <span className="text-sm font-medium text-blue-900">
            {linkedProduction.title}
          </span>
          <span className="text-xs text-blue-700">
            ({linkedProduction.completionPercentage || 0}%)
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/productions/${linkedProduction._id}/dashboard`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowUnlinkConfirm(true)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink Production</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlink "{linkedProduction.title}" from this event?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnlinkConfirm(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnlink}
              disabled={loading}
            >
              {loading ? 'Unlinking...' : 'Unlink'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
