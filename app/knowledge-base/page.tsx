'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KnowledgeItemCard from '@/components/KnowledgeItemCard';
import TagFilter from '@/components/TagFilter';
import { useAuth } from '@/contexts/AuthContext';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import { useTranslations } from 'next-intl';

export default function KnowledgeBasePage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('knowledge');
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [allItems, setAllItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items when selected tags change
    if (selectedTags.length === 0) {
      setItems(allItems);
    } else {
      fetchItemsByTags(selectedTags);
    }
  }, [selectedTags, allItems]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/knowledge-base');
      if (response.ok) {
        const data = await response.json();
        setAllItems(data);
        setItems(data);

        // Extract all unique tags
        const tags = new Set<string>();
        data.forEach((item: KnowledgeBaseItem) => {
          if (item.tags) {
            item.tags.forEach((tag) => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags).sort());
      }
    } catch (error) {
      console.error('Error fetching knowledge base items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByTags = async (tags: string[]) => {
    try {
      const tagsParam = tags.join(',');
      const response = await fetch(`/api/knowledge-base?tags=${encodeURIComponent(tagsParam)}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching filtered knowledge base items:', error);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagDeselect = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <style jsx global>{`
        @media print {
          nav,
          button,
          .no-print {
            display: none !important;
          }
          .knowledge-card {
            page-break-inside: avoid;
            border: 1px solid #ccc;
            padding: 1rem;
            margin-bottom: 1rem;
          }
          body {
            background: white;
          }
        }
      `}</style>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            Manage knowledge base articles and resources
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          {user?.isAdmin && (
            <Button onClick={() => router.push('/knowledge-base/new')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('addItem')}
            </Button>
          )}
        </div>
      </div>

      <TagFilter
        allTags={allTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagDeselect={handleTagDeselect}
        onClearAll={handleClearAllTags}
      />

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No knowledge base items yet.</p>
          {user?.isAdmin && (
            <Button onClick={() => router.push('/knowledge-base/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="knowledge-card">
              <KnowledgeItemCard
                item={item}
                onEdit={() => router.push(`/knowledge-base/${item._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
