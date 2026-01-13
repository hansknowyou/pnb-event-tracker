'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Videos } from '@/types/production';

interface Step9Props {
  data: Videos;
  onChange: (data: Videos) => void;
  onBlur: () => void;
}

export default function Step9Videos({ data, onChange, onBlur }: Step9Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 9: 视频媒体制作</h3>
        <p className="text-gray-600">Video Production</p>
      </div>

      {/* 9.1 Conference Loop Video */}
      <Card>
        <CardHeader>
          <CardTitle>9.1 Press Conference Loop Video (16:9)</CardTitle>
          <p className="text-sm text-gray-600">
            6-10 slides including: title, cast, program, date/time/location, organizers, logo page
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.conferenceLoop.link}
              onChange={(e) => onChange({
                ...data,
                conferenceLoop: { ...data.conferenceLoop, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.conferenceLoop.notes}
              onChange={(e) => onChange({
                ...data,
                conferenceLoop: { ...data.conferenceLoop, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 9.2 Main Promo Video */}
      <Card>
        <CardHeader>
          <CardTitle>9.2 Main Promotional Video (16:9 - Trailer Style)</CardTitle>
          <p className="text-sm text-gray-600">
            Performance clips montage + organizer logos + date/time/location
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.mainPromo.link}
              onChange={(e) => onChange({
                ...data,
                mainPromo: { ...data.mainPromo, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.mainPromo.notes}
              onChange={(e) => onChange({
                ...data,
                mainPromo: { ...data.mainPromo, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 9.3 Actor Intro Video */}
      <Card>
        <CardHeader>
          <CardTitle>9.3 Actor Introduction Video (16:9)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.actorIntro.link}
              onChange={(e) => onChange({
                ...data,
                actorIntro: { ...data.actorIntro, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.actorIntro.notes}
              onChange={(e) => onChange({
                ...data,
                actorIntro: { ...data.actorIntro, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
