'use client';

import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import type { Venue } from '@/types/venue';

interface VenueLinkButtonProps {
  linkedVenueId?: string;
  onSelect: (venue: Venue | null) => void;
  onImport?: (venue: Venue) => void;
}

export default function VenueLinkButton({
  linkedVenueId,
  onSelect,
  onImport,
}: VenueLinkButtonProps) {
  const t = useTranslations('venueLink');
  const [open, setOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [linkedVenue, setLinkedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      fetchVenues();
    }
  }, [open]);

  useEffect(() => {
    if (linkedVenueId) {
      fetchLinkedVenue();
    } else {
      setLinkedVenue(null);
    }
  }, [linkedVenueId]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/venues');
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedVenue = async () => {
    if (!linkedVenueId) return;
    try {
      const response = await fetch(`/api/venues/${linkedVenueId}`);
      if (response.ok) {
        const data = await response.json();
        setLinkedVenue(data);
      }
    } catch (error) {
      console.error('Error fetching linked venue:', error);
    }
  };

  const handleSelect = (venue: Venue) => {
    onSelect(venue);
    setOpen(false);
  };

  const handleUnlink = () => {
    onSelect(null);
    setLinkedVenue(null);
  };

  const handleImport = (venue: Venue) => {
    if (onImport) {
      onImport(venue);
    }
    setOpen(false);
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {linkedVenue ? t('changeVenue') : t('linkVenue')}
        </Button>

        {linkedVenue && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm">
            <span>{linkedVenue.name}</span>
            <button
              onClick={handleUnlink}
              className="hover:text-green-900"
              title={t('unlink')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('selectVenue')}</DialogTitle>
            <DialogDescription>
              {t('selectVenueDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : filteredVenues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? t('noResults') : t('noVenues')}
                </div>
              ) : (
                filteredVenues.map((venue) => (
                  <div
                    key={venue._id}
                    className={`p-4 rounded-lg border hover:border-blue-300 cursor-pointer transition-colors ${
                      linkedVenueId === venue._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleSelect(venue)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{venue.name}</h4>
                        {venue.city && (
                          <p className="text-sm text-gray-500">{venue.city}</p>
                        )}
                        {venue.location && (
                          <p className="text-sm text-gray-400">{venue.location}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {onImport && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImport(venue);
                            }}
                          >
                            {t('importData')}
                          </Button>
                        )}
                        <a
                          href={`/venues/${venue._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
