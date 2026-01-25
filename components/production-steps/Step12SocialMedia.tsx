'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { SocialMedia, Platform, Post } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

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
  // Platform management
  const addPlatform = () => {
    const newPlatform: Platform = {
      id: Date.now().toString(),
      platformName: '',
      posts: [],
    };
    onChange({ ...data, platforms: [...data.platforms, newPlatform] });
  };

  const removePlatform = (id: string) => {
    onChange({ ...data, platforms: data.platforms.filter((p) => p.id !== id) });
  };

  const updatePlatform = (id: string, field: keyof Platform, value: any) => {
    onChange({
      ...data,
      platforms: data.platforms.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  // Post management
  const addPost = (platformId: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      stage: 'warm-up',
      postLink: '',
      publishDate: '',
      notes: '',
    };

    onChange({
      ...data,
      platforms: data.platforms.map((p) =>
        p.id === platformId
          ? { ...p, posts: [...p.posts, newPost] }
          : p
      ),
    });
  };

  const removePost = (platformId: string, postId: string) => {
    onChange({
      ...data,
      platforms: data.platforms.map((p) =>
        p.id === platformId
          ? { ...p, posts: p.posts.filter((post) => post.id !== postId) }
          : p
      ),
    });
  };

  const updatePost = (
    platformId: string,
    postId: string,
    field: keyof Post,
    value: string
  ) => {
    onChange({
      ...data,
      platforms: data.platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              posts: p.posts.map((post) =>
                post.id === postId ? { ...post, [field]: value } : post
              ),
            }
          : p
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step12')}</h3>
          <p className="text-gray-600">Social Media</p>
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

      {/* Website Update */}
      <Card>
        <CardHeader>
          <CardTitle>Website Update</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="website-added"
              checked={data.websiteUpdated.isAdded}
              onCheckedChange={(checked) => onChange({
                ...data,
                websiteUpdated: { ...data.websiteUpdated, isAdded: checked as boolean }
              })}
            />
            <Label htmlFor="website-added" className="cursor-pointer">
              Added to Website
            </Label>
          </div>
          <div>
            <Label>Website Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.websiteUpdated.link}
              onChange={(e) => onChange({
                ...data,
                websiteUpdated: { ...data.websiteUpdated, link: e.target.value }
              })}
                          />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.websiteUpdated.notes}
              onChange={(e) => onChange({
                ...data,
                websiteUpdated: { ...data.websiteUpdated, notes: e.target.value }
              })}
                          />
          </div>
        </CardContent>
      </Card>

      {/* Platform Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Platforms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.platforms.map((platform, pIndex) => (
            <div key={platform.id} className="border-2 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold text-lg">Platform {pIndex + 1}</h5>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePlatform(platform.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>Platform Name</Label>
                <Input
                  placeholder="e.g., WeChat, Facebook, Instagram"
                  value={platform.platformName}
                  onChange={(e) => updatePlatform(platform.id, 'platformName', e.target.value)}
                                  />
              </div>

              <div className="border-t pt-4">
                <h6 className="font-medium mb-3">Posts</h6>
                <div className="space-y-3">
                  {platform.posts.map((post, postIndex) => (
                    <div key={post.id} className="border rounded p-3 space-y-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Post {postIndex + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePost(platform.id, post.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Stage</Label>
                          <Select
                            value={post.stage}
                            onValueChange={(value) =>
                              updatePost(platform.id, post.id, 'stage', value)
                            }
                          >
                            <SelectTrigger onBlur={onBlur}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="warm-up">Warm-up (预热)</SelectItem>
                              <SelectItem value="ticket-launch">Ticket Launch (开票)</SelectItem>
                              <SelectItem value="promotion">Promotion (推票)</SelectItem>
                              <SelectItem value="live">Live (现场)</SelectItem>
                              <SelectItem value="summary">Summary (总结)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Publish Date</Label>
                          <Input
                            type="date"
                            value={post.publishDate}
                            onChange={(e) =>
                              updatePost(platform.id, post.id, 'publishDate', e.target.value)
                            }
                                                      />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Post Link</Label>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={post.postLink}
                          onChange={(e) =>
                            updatePost(platform.id, post.id, 'postLink', e.target.value)
                          }
                                                  />
                      </div>

                      <div>
                        <Label className="text-xs">Notes</Label>
                        <Textarea
                          placeholder="Notes..."
                          rows={1}
                          value={post.notes}
                          onChange={(e) =>
                            updatePost(platform.id, post.id, 'notes', e.target.value)
                          }
                                                  />
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => addPost(platform.id)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Add Post
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addPlatform} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </CardContent>
      </Card>

      {/* Facebook Event */}
      <Card>
        <CardHeader>
          <CardTitle>Facebook Event Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Event Link</Label>
            <Input
              type="url"
              placeholder="https://facebook.com/events/..."
              value={data.facebookEvent.link}
              onChange={(e) => onChange({
                ...data,
                facebookEvent: { ...data.facebookEvent, link: e.target.value }
              })}
                          />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.facebookEvent.notes}
              onChange={(e) => onChange({
                ...data,
                facebookEvent: { ...data.facebookEvent, notes: e.target.value }
              })}
                          />
          </div>
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
