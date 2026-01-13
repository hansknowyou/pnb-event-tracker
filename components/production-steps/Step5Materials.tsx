'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { Materials, Video, Logo } from '@/types/production';

interface Step5Props {
  data: Materials;
  onChange: (data: Materials) => void;
  onBlur: () => void;
}

export default function Step5Materials({ data, onChange, onBlur }: Step5Props) {
  // Video management
  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      link: '',
      notes: '',
    };
    onChange({ ...data, videos: [...data.videos, newVideo] });
  };

  const removeVideo = (id: string) => {
    onChange({ ...data, videos: data.videos.filter((v) => v.id !== id) });
  };

  const updateVideo = (id: string, field: keyof Video, value: string) => {
    onChange({
      ...data,
      videos: data.videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    });
  };

  // Logo management
  const addLogo = () => {
    const newLogo: Logo = {
      id: Date.now().toString(),
      organizationType: 'sponsor',
      organizationName: '',
      colorHorizontal: '',
      colorVertical: '',
      whiteHorizontal: '',
      whiteVertical: '',
    };
    onChange({ ...data, logos: [...data.logos, newLogo] });
  };

  const removeLogo = (id: string) => {
    onChange({ ...data, logos: data.logos.filter((l) => l.id !== id) });
  };

  const updateLogo = (id: string, field: keyof Logo, value: string) => {
    onChange({
      ...data,
      logos: data.logos.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 5: 基础素材收集</h3>
        <p className="text-gray-600">Material Collection</p>
      </div>

      {/* 5.1 Videos (minimum 3) */}
      <Card>
        <CardHeader>
          <CardTitle>5.1 Past Performance Videos (Minimum 3)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.videos.length < 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              ⚠️ At least 3 videos are required. Currently: {data.videos.length}
            </div>
          )}

          {data.videos.map((video, index) => (
            <div key={video.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Video {index + 1}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVideo(video.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                type="url"
                placeholder="Video link (https://...)"
                value={video.link}
                onChange={(e) => updateVideo(video.id, 'link', e.target.value)}
                onBlur={onBlur}
              />
              <Textarea
                placeholder="Notes..."
                rows={2}
                value={video.notes}
                onChange={(e) => updateVideo(video.id, 'notes', e.target.value)}
                onBlur={onBlur}
              />
            </div>
          ))}

          <Button onClick={addVideo} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </CardContent>
      </Card>

      {/* 5.2 Performance Photos */}
      <Card>
        <CardHeader>
          <CardTitle>5.2 Performance Scene Photos (5-10 photos)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Photo Link / Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.photos.link}
              onChange={(e) => onChange({ ...data, photos: { ...data.photos, link: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.photos.notes}
              onChange={(e) => onChange({ ...data, photos: { ...data.photos, notes: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.3 Actor Photos */}
      <Card>
        <CardHeader>
          <CardTitle>5.3 Main Actor Headshot Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Photo Link / Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.actorPhotos.link}
              onChange={(e) => onChange({ ...data, actorPhotos: { ...data.actorPhotos, link: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.actorPhotos.notes}
              onChange={(e) => onChange({ ...data, actorPhotos: { ...data.actorPhotos, notes: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.4 Other Element Photos */}
      <Card>
        <CardHeader>
          <CardTitle>5.4 Other Element Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Photo Link / Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.otherPhotos.link}
              onChange={(e) => onChange({ ...data, otherPhotos: { ...data.otherPhotos, link: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.otherPhotos.notes}
              onChange={(e) => onChange({ ...data, otherPhotos: { ...data.otherPhotos, notes: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.5 Logos */}
      <Card>
        <CardHeader>
          <CardTitle>5.5 Organization Logos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.logos.map((logo, index) => (
            <div key={logo.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Logo {index + 1}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeLogo(logo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Organization Type</Label>
                  <Select
                    value={logo.organizationType}
                    onValueChange={(value) => updateLogo(logo.id, 'organizationType', value)}
                  >
                    <SelectTrigger onBlur={onBlur}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sponsor">Sponsor (主办方)</SelectItem>
                      <SelectItem value="organizer">Organizer (承办方)</SelectItem>
                      <SelectItem value="executor">Executor (执行方)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Organization Name</Label>
                  <Input
                    placeholder="Organization name"
                    value={logo.organizationName}
                    onChange={(e) => updateLogo(logo.id, 'organizationName', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>Color Horizontal Logo URL</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={logo.colorHorizontal}
                    onChange={(e) => updateLogo(logo.id, 'colorHorizontal', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>Color Vertical Logo URL</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={logo.colorVertical}
                    onChange={(e) => updateLogo(logo.id, 'colorVertical', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>White Horizontal Logo URL</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={logo.whiteHorizontal}
                    onChange={(e) => updateLogo(logo.id, 'whiteHorizontal', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>White Vertical Logo URL</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={logo.whiteVertical}
                    onChange={(e) => updateLogo(logo.id, 'whiteVertical', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addLogo} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Logo
          </Button>
        </CardContent>
      </Card>

      {/* 5.6 Texts */}
      <Card>
        <CardHeader>
          <CardTitle>5.6 Performance Copy/Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Performance Title</Label>
            <Input
              placeholder="Title"
              value={data.texts.title}
              onChange={(e) => onChange({ ...data, texts: { ...data.texts, title: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Long Description</Label>
            <Textarea
              placeholder="Detailed description..."
              rows={4}
              value={data.texts.longDescription}
              onChange={(e) => onChange({ ...data, texts: { ...data.texts, longDescription: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Short Description</Label>
            <Textarea
              placeholder="Brief description..."
              rows={2}
              value={data.texts.shortDescription}
              onChange={(e) => onChange({ ...data, texts: { ...data.texts, shortDescription: e.target.value } })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
