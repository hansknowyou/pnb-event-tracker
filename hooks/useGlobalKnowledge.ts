'use client';

import { useState, useEffect, useCallback } from 'react';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface GlobalKnowledge {
  links: Record<string, string[]>;
  items: Record<string, KnowledgeBaseItem[]>;
}

export function useGlobalKnowledge() {
  const [globalKnowledge, setGlobalKnowledge] = useState<GlobalKnowledge>({
    links: {},
    items: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchGlobalKnowledge = useCallback(async () => {
    try {
      // Fetch global knowledge links
      const response = await fetch('/api/global-knowledge');
      if (!response.ok) return;

      const data = await response.json();
      const links = data.links || {};

      // Collect all unique knowledge IDs
      const allIds = new Set<string>();
      Object.values(links).forEach((ids) => {
        (ids as string[]).forEach((id) => allIds.add(id));
      });

      // Fetch all knowledge items at once
      let items: Record<string, KnowledgeBaseItem[]> = {};
      if (allIds.size > 0) {
        const batchResponse = await fetch('/api/knowledge-base/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: Array.from(allIds) }),
        });

        if (batchResponse.ok) {
          const allItems = await batchResponse.json();
          const itemsById: Record<string, KnowledgeBaseItem> = {};
          allItems.forEach((item: KnowledgeBaseItem) => {
            itemsById[item._id] = item;
          });

          // Group items by section
          Object.entries(links).forEach(([section, ids]) => {
            items[section] = (ids as string[])
              .map((id) => itemsById[id])
              .filter(Boolean);
          });
        }
      }

      setGlobalKnowledge({ links, items });
    } catch (error) {
      console.error('Error fetching global knowledge:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalKnowledge();
  }, [fetchGlobalKnowledge]);

  const getLinkedIds = useCallback(
    (section: string): string[] => {
      return globalKnowledge.links[section] || [];
    },
    [globalKnowledge.links]
  );

  const getLinkedItems = useCallback(
    (section: string): KnowledgeBaseItem[] => {
      return globalKnowledge.items[section] || [];
    },
    [globalKnowledge.items]
  );

  return {
    loading,
    getLinkedIds,
    getLinkedItems,
    refetch: fetchGlobalKnowledge,
  };
}
