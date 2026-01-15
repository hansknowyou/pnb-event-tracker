'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import Image from 'next/image';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface KnowledgeViewDialogProps {
  knowledgeItems: KnowledgeBaseItem[];
  open: boolean;
  onClose: () => void;
}

export default function KnowledgeViewDialog({
  knowledgeItems,
  open,
  onClose,
}: KnowledgeViewDialogProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Linked Knowledge Items</DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {knowledgeItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No knowledge items linked to this section.
            </div>
          ) : (
            knowledgeItems.map((item, index) => (
              <div
                key={item._id}
                className="border-b pb-6 last:border-b-0 last:pb-0"
              >
                <h3 className="text-xl font-semibold mb-3">
                  {index + 1}. {item.title}
                </h3>

                {item.imageUrl && (
                  <div className="relative w-full h-64 rounded-md overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {item.description && (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}

                <div className="text-xs text-gray-500 mt-3">
                  Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
